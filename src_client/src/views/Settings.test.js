import { fireEvent, screen,waitFor } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../testing/utils"
import Settings from "./Settings"
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Settings",()=>{
    test("renders correctly",()=>{
        const asFragment=renderAsFragment(Settings)
        const html=asFragment()
        expect(html).toMatchSnapshot()
    })
    describe("Restart/Relaunch services",()=>{
        test("Feeds",async ()=>{
            clearLocalStorage()
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)                
            const SettingsElement=await screen.findByText("Settings")
            fireEvent.click(SettingsElement)    
            await screen.findByText("Control your Elabox")    
            const feedsRelaunchBtn=screen.getByTestId("green-feeds-btn")
            expect(feedsRelaunchBtn).toBeInTheDocument()         
            fireEvent.click(feedsRelaunchBtn)
            const restartBtn=await screen.findByTestId("restart-btn")
            expect(restartBtn).toBeInTheDocument()        
            fireEvent.click(restartBtn)
        })
        test("Carrier",async ()=>{
            clearLocalStorage()
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)                
            const SettingsElement=await screen.findByText("Settings")
            fireEvent.click(SettingsElement)    
            await screen.findByText("Control your Elabox")    
            const CarrierRelaunchButon=screen.getByTestId("green-carrier-btn")
            expect(CarrierRelaunchButon).toBeInTheDocument()         
            fireEvent.click(CarrierRelaunchButon)
            const restartBtn=await screen.findByTestId("restart-btn")
            expect(restartBtn).toBeInTheDocument()        
            fireEvent.click(restartBtn)            
        })
        test("ESC",async ()=>{
            clearLocalStorage()
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)                
            const SettingsElement=await screen.findByText("Settings")
            fireEvent.click(SettingsElement)    
            await screen.findByText("Control your Elabox")    
            const EscRelauchButton=screen.getByTestId("green-esc-btn")
            expect(EscRelauchButton).toBeInTheDocument()         
            fireEvent.click(EscRelauchButton)
            const restartBtn=await screen.findByTestId("restart-btn")
            expect(restartBtn).toBeInTheDocument()        
            fireEvent.click(restartBtn)                        
        })
        test("EID",async ()=>{
            clearLocalStorage()
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)                
            const SettingsElement=await screen.findByText("Settings")
            fireEvent.click(SettingsElement)    
            await screen.findByText("Control your Elabox")    
            const ElaRelaunchBtn=screen.getByTestId("green-ela-btn")
            expect(ElaRelaunchBtn).toBeInTheDocument()         
            fireEvent.click(ElaRelaunchBtn)
            const restartBtn=await screen.findByTestId("restart-btn")
            expect(restartBtn).toBeInTheDocument()        
            fireEvent.click(restartBtn)                        
        })        
        test("EID",async ()=>{
            clearLocalStorage()
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)                
            const SettingsElement=await screen.findByText("Settings")
            fireEvent.click(SettingsElement)    
            await screen.findByText("Control your Elabox")    
            const EidRelaunchBtn=screen.getByTestId("green-ela-btn")
            expect(EidRelaunchBtn).toBeInTheDocument()         
            fireEvent.click(EidRelaunchBtn)
            const restartBtn=await screen.findByTestId("restart-btn")
            expect(restartBtn).toBeInTheDocument()        
            fireEvent.click(restartBtn)                        
        })            
    })
})