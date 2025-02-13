import axios from "axios";
import { SimpleAdapter } from "../../adapters/types"
import { CHAIN } from "../../helpers/chains"
import { getUniqStartOfTodayTimestamp } from "../../helpers/getUniSubgraphVolume";
interface IData {
  create_time: string;
  volume_usd_24h: string;
  swap_fee_24h: string;
}

const fetchVolume = async (timestamp: number) => {
  const url = "https://noahark.pro/api/swap/get1dSnapshot";
  const body = {
    type: "month"
  }
  const dayTimestamp = getUniqStartOfTodayTimestamp(new Date(timestamp * 1000));
  const dateString = new Date(timestamp * 1000).toISOString().split("T")[0];
  const res: IData[] = (await axios.post(url, body, { headers: { "Chainid": 17777 }})).data.data as IData[];
  const dayItem = res.find(item => item.create_time.split('T')[0] === dateString);
  if (!dayItem) {
    return {
      timestamp: dayTimestamp,
      totalVolume: undefined,
      dailyVolume: undefined,
    }
  }
  const dailyVolume = dayItem.volume_usd_24h;
  const dailyFees = dayItem.swap_fee_24h;
  return {
    dailyVolume: dailyVolume,
    dailyFees: dailyFees,
    timestamp
  }
}
const adapters: SimpleAdapter  = {
  adapter: {
    [CHAIN.EOS_EVM]: {
      fetch: fetchVolume,
      start: async () => 1699315200
    }
  }
}

export default adapters
