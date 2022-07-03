import hecoAirdrop from "@/config/abi/heco/hecoAirdrop.json";
import hecoMasterchef from '@/config/abi/heco/hecoMasterchef.json'
import hecoMining from '@/config/abi/heco/swapMining.json'
import bscMasterchef from '@/config/abi/bsc/bscMasterchef.json'
const airdropConfig = {
  128: {
    liquidity: hecoMasterchef,
    boardroom: hecoAirdrop,
    mining: hecoMining
  },
  56: {
    liquidity: bscMasterchef,
    boardroom: hecoAirdrop,
    mining: hecoMining
  }
};

export default airdropConfig;
