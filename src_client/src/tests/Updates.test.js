import { fireEvent, screen,waitFor } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../utils/testing"
import Updates from "../views/Updates"
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Updates",()=>{
    test("renders correctly",()=>{
        const asFragment=renderAsFragment(Updates)
        const html=asFragment()
        expect(html).toMatchSnapshot()
    })    
    describe("new updates",()=>{
        test("Able to download",async ()=>{
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)                
            const UpdatesElement=await screen.findByText("Updates")
            fireEvent.click(UpdatesElement)    
            await screen.findByText("New Update available")
            const downloadBtn=screen.getByTestId("download-btn")
            fireEvent.click(downloadBtn)
            const updateProcess=await screen.findByTestId("update-progress")
            expect(updateProcess).toBeInTheDocument()
        })
    })
    test("no updates",async ()=>{
        server.use(rest.get(`${BASE_URL}/check_new_updates`, (req, res, ctx) => {
            return res(
              ctx.json({
                current: 3,
                latest: 3,
                new_update: false,
                count: 1,
              })
            )
          }))
        renderApp()
        await screen.findByText("Sign In")
        const passwordInput = screen.getByTestId("password")
        const signInBtn = screen.getByTestId("sign-in-btn")
        fireEvent.change(passwordInput, { target: { value: "Tester" } })
        fireEvent.click(signInBtn)                
        const UpdatesElement=await screen.findByText("Updates")
        fireEvent.click(UpdatesElement)   
        expect(screen.queryByText("No updates")).not.toBeNull()
        expect(screen.queryByTestId("download-btn")).toBeNull()
    })
})