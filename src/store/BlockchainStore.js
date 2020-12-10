import { types, flow } from "mobx-state-tree";
import API from "../api/backend";

const Ela = types
  .model({
    running: types.maybeNull(types.boolean),
  })
  .actions((self) => {
    const changeRunning = (status) => {
      self.running = status;
    };

    return { changeRunning };
  });

const Did = types
  .model({
    running: types.maybeNull(types.boolean),
  })
  .actions((self) => {
    const changeRunning = (status) => {
      self.running = status;
    };

    return { changeRunning };
  });

const Carrier = types
  .model({
    running: types.maybeNull(types.boolean),
  })
  .actions((self) => {
    const changeRunning = (status) => {
      self.running = status;
    };

    return { changeRunning };
  });

const BlockChainStore = types
  .model({
    ela: types.model(Ela),
    did: types.model(Did),
    carrier: types.model(Carrier),
  })
  .actions((self) => {
    const fetchData = flow(function* () {
      try {
        const response = API.latestBlock;
      } catch (error) {}
    });
  });

export default BlockChainStore;
