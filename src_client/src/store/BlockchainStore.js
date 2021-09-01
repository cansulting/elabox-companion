import { types, flow, applySnapshot } from "mobx-state-tree";
import API from "../api/backend";

const LatestBlock = types.model({
  blockTime: types.maybeNull(types.number),
  blockHash: types.optional(types.string, ""),
  miner: types.optional(types.string, ""),
});

export const Ela = types
  .model({
    servicesRunning: types.optional(types.boolean, false),
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

    const restart = flow(function* () {
      try {
        self.restarting = true;
        const response = yield API.restartMainChain();
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        self.restarting = false;
      }
    });

    return { fetchData, restart };
  });

export const eid = types
  .model({
    servicesRunning: types.optional(types.boolean, false),
    restarting: types.optional(types.boolean, false),
    isRunning: types.maybeNull(types.boolean),
    blockCount: types.optional(types.number, 0),
    blockSizes: types.optional(types.array(types.number), []),
    nbOfTxs: types.optional(types.array(types.number), []),
    latestBlock: types.optional(LatestBlock, {}),
  })
  .actions((self) => {
    const fetchData = flow(function* () {
      try {
        const response = yield API.fetchEID();
        applySnapshot(self, response);
      } catch (err) {
        console.error(err);
      }
    });

    const restart = flow(function* () {
      try {
        self.restarting = true;
        const response = yield API.restartEID();
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        self.restarting = false;
      }
    });

    return { fetchData, restart };
  });

export const Carrier = types
  .model({
    isRunning: types.maybeNull(types.boolean),
    carrierIP: "",
    restarting: false,
  })
  .actions((self) => {
    const fetchData = flow(function* () {
      try {
        const response = yield API.fetchCarrier();
        applySnapshot(self, response);
      } catch (err) {
        console.error(fetchData);
      }
    });

    const restart = flow(function* () {
      try {
        self.restarting = true;
        const response = yield API.restartCarrier();
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        self.restarting = false;
      }
    });

    return { fetchData, restart };
  });

const BlockChainStore = types.model({
  ela: Ela,
  eid: eid,
  carrier: Carrier,
});

export default BlockChainStore;
