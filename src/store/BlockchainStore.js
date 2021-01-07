import { types, flow, applySnapshot } from "mobx-state-tree";
import API from "../api/backend";

const LatestBlock = types.model({
  blockTime: types.maybeNull(types.number),
  blockHash: types.optional(types.string, ""),
  miner: types.optional(types.string, ""),
});

export const Ela = types
  .model({
    isRunning: types.maybeNull(types.boolean),
    blockCount: types.optional(types.number, 0),
    blockSizes: types.optional(types.array(types.number), []),
    nbOfTxs: types.optional(types.array(types.number), []),
    latestBlock: types.optional(LatestBlock, {}),
  })
  .actions((self) => {
    const fetchData = flow(function* () {
      try {
        const response = yield API.fetchEla();
        applySnapshot(self, response);
      } catch (err) {
        console.error(err);
      }
    });

    return { fetchData };
  });

export const Did = types
  .model({
    isRunning: types.maybeNull(types.boolean),
    blockCount: types.optional(types.number, 0),
    blockSizes: types.optional(types.array(types.number), []),
    nbOfTxs: types.optional(types.array(types.number), []),
    latestBlock: types.optional(LatestBlock, {}),
  })
  .actions((self) => {
    const fetchData = flow(function* () {
      try {
        const response = yield API.fetchDid();
        applySnapshot(self, response);
      } catch (err) {
        console.error(err);
      }
    });

    return { fetchData };
  });

export const Carrier = types
  .model({
    running: types.maybeNull(types.boolean),
  })
  .actions((self) => {
    const changeRunning = (status) => {
      self.running = status;
    };

    return { changeRunning };
  });

const BlockChainStore = types.model({
  ela: Ela,
  did: Did,
  carrier: Carrier,
});

export default BlockChainStore;
