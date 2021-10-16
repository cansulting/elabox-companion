import { fireEvent, screen } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../utils/testing"
import Dashboard from "../views/Dashboard"
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
describe("Dashboard", () => {
  test("renders correctly",()=>{
    const asFragment=renderAsFragment(Dashboard)
    const html=asFragment()
    expect(html).toMatchSnapshot()
  })  
  describe("services is running", () => {
    test("ELA", async () => {
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)        
      await checkService("ELA", "isRunning")
    })
    test("EID", async () => {
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)        
      await checkService("EID", "isRunning")
    })
    test("ESC", async () => {
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)        
      await checkService("ESC", "isRunning")
    })
    test("Feeds", async () => {
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)        
      await checkService("Feeds", "isRunning")
    })
    test("Carrier", async () => {
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)        
      await checkService("Carrier", "isRunning")
    })
  })
  describe("services is not running", () => {
    test("ELA", async () => {
      server.use(
        rest.get(`${BASE_URL}/ela`, (req, res, ctx) => {
          return res(ctx.json({ isRunning: false, servicesRunning: false }))
        })
      )
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)        
      await checkService("ELA", "notRunning")
    })
    test("EID", async () => {
      server.use(
        rest.get(`${BASE_URL}/eid`, (req, res, ctx) => {
          return res(ctx.json({ isRunning: false, servicesRunning: false }))
        })
      )
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)
      await checkService("EID", "notRunning")
    })
    test("ESC", async () => {
      server.use(
        rest.get(`${BASE_URL}/esc`, (req, res, ctx) => {
          return res(ctx.json({ isRunning: false, servicesRunning: false }))
        })
      )
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)
      await checkService("ESC", "notRunning")
    })
    test("Feeds", async () => {
      server.use(
        rest.get(`${BASE_URL}/feeds`, (req, res, ctx) => {
          return res(ctx.json({ isRunning: false }))
        })
      )
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)
      await checkService("Feeds", "notRunning")
    })
    test("Carrier", async () => {
      server.use(
        rest.get(`${BASE_URL}/carrier`, (req, res, ctx) => {
          return res(ctx.json({ isRunning: false }))
        })
      )
      renderApp()
      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)
      await checkService("Carrier", "notRunning")
    })
  })
})
