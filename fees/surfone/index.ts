import { SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getUniqStartOfTodayTimestamp } from "../../helpers/getUniSubgraphVolume";
import axios from "axios";

const volumeEndpoint = "https://apigateway.surf.one/pool/24h/data"

const headers = {
  "Block-Chain-Id":  '8453',
};

interface IVolume {
  totalTradeFee: number,
}

const fetch = () => {
  return async (timestamp: number) => {
    const dayTimestamp = getUniqStartOfTodayTimestamp(new Date(timestamp * 1000))
    const response = (await axios.get(volumeEndpoint, { headers }));

    const volume: IVolume = response.data.data;
    return {
      dailyFees: `${volume?.totalTradeFee || undefined}`,
      timestamp: dayTimestamp,
    };
  };
}


const adapter: SimpleAdapter = {
  adapter: {
    [CHAIN.BASE]: {
      fetch: fetch(),
      runAtCurrTime: true,
      start: async () => 7963804,
    }
  },
};

export default adapter;
