import { Ela, Did } from "../BlockchainStore";

it("can create instance of Ela", () => {
  const ela = Ela.create({
    blockCount: 446493,
    blockSizes: [1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565],
    nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    isRunning: true,
    latestblock: {
      blockTime: 1609931043,
      blockHash:
        "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
      miner: 12,
    },
  });

  expect(ela.isRunning).toBe(true);
});

it("can create instance of Did", () => {
  const did = Did.create({
    blockCount: 446493,
    blockSizes: [1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565],
    nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    isRunning: true,
    latestblock: {
      blockTime: 1609931043,
      blockHash:
        "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
      miner: 12,
    },
  });

  expect(did.isRunning).toBe(true);
});
