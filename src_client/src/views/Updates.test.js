import { fireEvent, screen,waitFor } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../testing/utils"
import Updates from "./Updates"
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Updates",()=>{
    test("renders correctly",()=>{
        const asFragment=renderAsFragment(Updates)
        const html=asFragment()
        expect(html).toMatchSnapshot()
    })    
    describe("Download",()=>{
        test("Able to download",async ()=>{
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)                
            const SettingsElement=await screen.findByText("Updates")
            fireEvent.click(SettingsElement)    
            await screen.findByText("New Update available")
            const downloadBtn=screen.getByTestId("download-btn")
            fireEvent.click(downloadBtn)
            const updateProcess=await screen.findByTestId("update-progress")
            expect(updateProcess).toBeInTheDocument()
        })
    })
})