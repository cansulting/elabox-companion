import { fireEvent, screen,waitFor } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../utils/testing"
import Login from "../views/Login"
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
describe("Login",()=>{
    test("renders correctly",()=>{
        const asFragment=renderAsFragment(Login)
        const html=asFragment()
        expect(html).toMatchSnapshot()
    })
    test("Able to login",async ()=>{
        renderApp()
        await screen.findByText("Sign In")
        const passwordInput = screen.getByTestId("password")
        const signInBtn = screen.getByTestId("sign-in-btn")
        fireEvent.change(passwordInput, { target: { value: "Tester" } })
        fireEvent.click(signInBtn)                
        const dashboardElement = await screen.findByText("Dashboard")
        expect(dashboardElement).toBeInTheDocument()                    
    })
    test("Not able to login",async ()=>{
        server.use(rest.post(`${BASE_URL}/login`, (req, res, ctx) => {
            return res(
              ctx.json({
                ok: false,
              })
            )
        }))
        jest.spyOn(window, 'alert').mockImplementation(() => {});    
        renderApp()
        await screen.findByText("Sign In")
        const passwordInput = screen.getByTestId("password")
        const signInBtn = screen.getByTestId("sign-in-btn")
        fireEvent.change(passwordInput, { target: { value: "Tester" } })
        fireEvent.click(signInBtn)                    
        await waitFor(()=> expect(window.alert).toHaveBeenCalledWith("Wrong password"))
        expect(window.alert).toHaveBeenCalled()
    })        
})