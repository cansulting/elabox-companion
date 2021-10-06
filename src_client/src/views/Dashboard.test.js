import React from "react"
import { render, fireEvent, screen, act } from "@testing-library/react"
import { server, rest, BASE_URL } from "../setupTests"
import App from "../App"
const checkService = async (serviceName, status) => {
  await screen.findByText(serviceName)
  const elaParagraph = screen.getByText(serviceName)
  if (status === "isRunning") {
    expect(elaParagraph.style.color).toBe("lightgreen")
  } else {
    expect(elaParagraph.style.color).not.toBe("lightgreen")
  }
}
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
describe("Test Dashboard Component", () => {
  beforeAll(async () => {
    render(<App />)
    await screen.findByText("Sign In")
    const passwordInput = screen.getByTestId("password")
    const loginForm = screen.getByTestId("login-form")
    fireEvent.change(passwordInput, { target: { value: "Tester" } })
    fireEvent.submit(loginForm)
  })
  describe("services is running", () => {
    test("ELA", async () => {
      await act(async () => {
        render(<App />)
        await checkService("ELA", "isRunning")
      })
    })
    test("EID", async () => {
      await act(async () => {
        render(<App />)
        await checkService("EID", "isRunning")
      })
    })
    test("ESC", async () => {
      await act(async () => {
        render(<App />)
        await checkService("ESC", "isRunning")
      })
    })
    test("Feeds", async () => {
      await act(async () => {
        render(<App />)
        await checkService("Feeds", "isRunning")
      })
    })
    test("Carrier", async () => {
      await act(async () => {
        render(<App />)
        await checkService("Carrier", "isRunning")
      })
    })
  })
  describe("services is not running", () => {
    test("ELA", async () => {
      await act(async () => {
        server.use(
          rest.get(`${BASE_URL}/ela`, (req, res, ctx) => {
            return res(ctx.json({ isRunning: false, servicesRunning: false }))
          })
        )
        render(<App />)
        await checkService("ELA", "notRunning")
      })
    })
    test("EID", async () => {
      await act(async () => {
        server.use(
          rest.get(`${BASE_URL}/eid`, (req, res, ctx) => {
            return res(ctx.json({ isRunning: false, servicesRunning: false }))
          })
        )
        render(<App />)
        await checkService("EID", "notRunning")
      })
    })
    test("ESC", async () => {
      await act(async () => {
        server.use(
          rest.get(`${BASE_URL}/esc`, (req, res, ctx) => {
            return res(ctx.json({ isRunning: false, servicesRunning: false }))
          })
        )
        render(<App />)
        await checkService("ESC", "notRunning")
      })
    })
    test("Feeds", async () => {
      await act(async () => {
        server.use(
          rest.get(`${BASE_URL}/feeds`, (req, res, ctx) => {
            return res(ctx.json({ isRunning: false }))
          })
        )
        render(<App />)
        await checkService("Feeds", "notRunning")
      })
    })
    test("Carrier", async () => {
      await act(async () => {
        server.use(
          rest.get(`${BASE_URL}/carrier`, (req, res, ctx) => {
            return res(ctx.json({ isRunning: false }))
          })
        )
        render(<App />)
        await checkService("Carrier", "notRunning")
      })
    })
  })
})
