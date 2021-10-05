import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import App from "../App"
const server = setupServer(
  rest.get("http://localhost:3001/check_new_updates", (req, res, ctx) => {
    return res(
      ctx.json({
        current: 3,
        latest: 3,
        new_update: false,
        count: 1,
      })
    )
  }),
  rest.get("http://localhost:3001/feeds", (req, res, ctx) => {
    return res(
      ctx.json({
        isRunning: true,
      })
    )
  }),
  rest.get("http://localhost:3001/carrier", (req, res, ctx) => {
    return res(
      ctx.json({
        isRunning: true,
        carrierIP: "203.189.118.100",
      })
    )
  }),
  rest.get("http://localhost:3001/esc", (req, res, ctx) => {
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
  rest.get("http://localhost:3001/ela", (req, res, ctx) => {
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
  rest.get("http://localhost:3001/eid", (req, res, ctx) => {
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
  })
)
const checkServiceIfRunning = async (serviceName) => {
  await screen.findByText(serviceName)
  const elaParagraph = screen.getByText(serviceName)
  expect(elaParagraph.style.color).toBe("lightgreen")
}
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
describe("Test Dashboard Component", () => {
  describe("services is running", () => {
    beforeAll(async () => {
      render(<App />)
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const loginForm = screen.getByTestId("login-form")
      fireEvent.change(passwordInput, { target: { value: "Blackhat06" } })
      fireEvent.submit(loginForm)
    })
    test("Ela is running", async () => {
      render(<App />)
      await checkServiceIfRunning("ELA")
    })
    test("Eid is running", async () => {
      render(<App />)
      await checkServiceIfRunning("ELA")
    })
    test("ESC is running", async () => {
      render(<App />)
      await checkServiceIfRunning("ESC")
    })
    test("Feeds is running", async () => {
      render(<App />)
      await checkServiceIfRunning("Feeds")
    })
    test("Carrier is running", async () => {
      render(<App />)
      await checkServiceIfRunning("Carrier")
    })
  })
})
