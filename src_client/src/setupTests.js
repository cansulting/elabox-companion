// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect"
import { rest } from "msw"
import { setupServer } from "msw/node"
const BASE_URL = "http://" + window.location.hostname + ":3001"
const handlers = [
  rest.post(`${BASE_URL}/version_info`, (req, res, ctx) => {
    return res(
      ctx.json({
        env: "debug",
      })
    )
  }),
  rest.post(`${BASE_URL}/login`, (req, res, ctx) => {
    return res(
      ctx.json({
        ok: true,
        address: "EPtbyXKqsT9TXZ1Hu1SdFRihW52wBQXr7u",
      })
    )
  }),
  rest.get(`${BASE_URL}/checkInstallation`, (req, res, ctx) => {
    return res(ctx.json({ configed: "true" }))
  }),
  rest.get(`${BASE_URL}/check_new_updates`, (req, res, ctx) => {
    return res(
      ctx.json({
        current: 3,
        latest: 3,
        new_update: false,
        count: 0,
      })
    )
  }),
  rest.get(`${BASE_URL}/feeds`, (req, res, ctx) => {
    return res(
      ctx.json({
        isRunning: true,
      })
    )
  }),
  rest.get(`${BASE_URL}/carrier`, (req, res, ctx) => {
    return res(
      ctx.json({
        isRunning: true,
        carrierIP: "203.189.118.100",
      })
    )
  }),
  rest.get(`${BASE_URL}/esc`, (req, res, ctx) => {
    return res(
      ctx.json({
        blockCount: 446493,
        blockSizes: [
          1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565,
        ],
        nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        isRunning: true,
        servicesRunning: true,
        latestblock: {
          blockTime: 1609931043,
          blockHash:
            "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
          miner: 12,
        },
      })
    )
  }),
  rest.get(`${BASE_URL}/ela`, (req, res, ctx) => {
    return res(
      ctx.json({
        blockCount: 446493,
        blockSizes: [
          1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565,
        ],
        nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        isRunning: true,
        servicesRunning: true,
        latestblock: {
          blockTime: 1609931043,
          blockHash:
            "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
          miner: 12,
        },
      })
    )
  }),
  rest.get(`${BASE_URL}/eid`, (req, res, ctx) => {
    return res(
      ctx.json({
        blockCount: 446493,
        blockSizes: [
          1596, 1597, 1552, 1749, 1653, 1652, 1653, 1620, 1526, 1565,
        ],
        nbOfTxs: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        isRunning: true,
        servicesRunning: true,
        latestblock: {
          blockTime: 1609931043,
          blockHash:
            "e572fbf42eb6d0c94d876813bda1ddd751f35f584e7d65c4d14d68586f7dacfb",
          miner: 12,
        },
      })
    )
  }),
]
const server = setupServer(...handlers)

export { server, rest, BASE_URL, handlers }
