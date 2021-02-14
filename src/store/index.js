import { types } from "mobx-state-tree";
import BlockchainStore from "./BlockchainStore";

const RootStore = types.model({
  blockchain: BlockchainStore,
});

export default RootStore.create({
  blockchain: { ela: {}, did: {}, carrier: {} },
});
