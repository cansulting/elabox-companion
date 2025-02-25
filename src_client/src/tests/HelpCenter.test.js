
import { fireEvent, screen,waitFor } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../utils/testing"
import HelpCenter from "../views/HelpCentre"
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
describe("Help Center", ()=>{
    test("renders correctly",()=>{
        const asFragment=renderAsFragment(HelpCenter)
        const html=asFragment()
        expect(html).toMatchSnapshot()
    })      
    describe("Email",()=>{
        test("Able to send Email",async()=>{
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)
            await screen.findByText("Dashboard")
            const helpCenterElement=await screen.findByText("Help Center")
            fireEvent.click(helpCenterElement)    
            await screen.findByText("Need Help or Assistance?")             
            const nameElement= screen.getByTestId("name")            
            const emailElement= screen.getByTestId("email")                        
            const problemElement= screen.getByTestId("problem")
            const helpSubmitBtn=screen.getByTestId("submit-help-btn")
            fireEvent.change(nameElement,{ target: { value: "tester" } })
            fireEvent.change(emailElement,{ target: { value: "tester@test.com" } })            
            fireEvent.change(problemElement,{ target: { value: "this is a problem" } })                        
            fireEvent.click(helpSubmitBtn)
            const successMessage=await screen.findByText("Success! An Elabox Support representative will reach out to you shortly.")
            expect(successMessage).toBeInTheDocument()
        });
        test("Not able to send Email",async()=>{
            server.use(  rest.post(`${BASE_URL}/sendSupportEmail`,(req,res,ctx)=>{
                return res(ctx.status(500))
            }))
            renderApp()
            await screen.findByText("Sign In")
            const passwordInput = screen.getByTestId("password")
            const signInBtn = screen.getByTestId("sign-in-btn")
            fireEvent.change(passwordInput, { target: { value: "Tester" } })
            fireEvent.click(signInBtn)
            await screen.findByText("Dashboard")
            const helpCenterElement=await screen.findByText("Help Center")
            fireEvent.click(helpCenterElement)    
            await screen.findByText("Need Help or Assistance?") 
            const nameElement= screen.getByTestId("name")            
            const emailElement= screen.getByTestId("email")                        
            const problemElement= screen.getByTestId("problem")
            const helpSubmitBtn=screen.getByTestId("submit-help-btn")
            fireEvent.change(nameElement,{ target: { value: "tester" } })
            fireEvent.change(emailElement,{ target: { value: "tester@test.com" } })            
            fireEvent.change(problemElement,{ target: { value: "this is a problem" } })                        
            fireEvent.click(helpSubmitBtn)
            const errorMessage=await screen.findByText("Please check your network connection")
            expect(errorMessage).toBeInTheDocument() 
        })        
    })
    describe("fields",()=>{
        describe("valid",()=>{
            test("no empty",async()=>{
                renderApp()
                await screen.findByText("Sign In")
                const passwordInput = screen.getByTestId("password")
                const signInBtn = screen.getByTestId("sign-in-btn")
                fireEvent.change(passwordInput, { target: { value: "Tester" } })
                fireEvent.click(signInBtn)
                await screen.findByText("Dashboard")
                const helpCenterElement=await screen.findByText("Help Center")
                fireEvent.click(helpCenterElement)    
                await screen.findByText("Need Help or Assistance?") 
                const nameElement= screen.getByTestId("name") 
                const emailElement= screen.getByTestId("email")                        
                const problemElement= screen.getByTestId("problem")   
                const helpSubmitBtn=screen.getByTestId("submit-help-btn")                     
                fireEvent.change(nameElement,{ target: { value: "tester" } })  
                fireEvent.change(emailElement,{ target: { value: "tester@test.com" } })            
                fireEvent.change(problemElement,{ target: { value: "this is a problem" } })                        
                fireEvent.click(helpSubmitBtn)
                const errors=screen.queryAllByText("Required")
                expect(errors.length).toBe(0)                                     
            })
        })
        describe("invalid",()=>{
            test("Email is Invalid",async()=>{
                renderApp()
                await screen.findByText("Sign In")
                const passwordInput = screen.getByTestId("password")
                const signInBtn = screen.getByTestId("sign-in-btn")
                fireEvent.change(passwordInput, { target: { value: "Tester" } })
                fireEvent.click(signInBtn)
                await screen.findByText("Dashboard")
                const helpCenterElement=await screen.findByText("Help Center")
                fireEvent.click(helpCenterElement)    
                await screen.findByText("Need Help or Assistance?") 
                const nameElement= screen.getByTestId("name") 
                const emailElement= screen.getByTestId("email")                        
                const problemElement= screen.getByTestId("problem")   
                const helpSubmitBtn=screen.getByTestId("submit-help-btn")                     
                fireEvent.change(nameElement,{ target: { value: "Tester" } })                            
                fireEvent.change(emailElement,{ target: { value: "testersaioj" } })            
                fireEvent.change(problemElement,{ target: { value: "this is a problem" } })                        
                fireEvent.click(helpSubmitBtn)
                await screen.findByText("Invalid Email")
                const invalidEmailElement=screen.queryByText("Invalid Email")
                expect(invalidEmailElement).toBeInTheDocument()                                                 
            })
            test("empty all fields",async()=>{

                renderApp()
                await screen.findByText("Sign In")
                const passwordInput = screen.getByTestId("password")
                const signInBtn = screen.getByTestId("sign-in-btn")
                fireEvent.change(passwordInput, { target: { value: "Tester" } })
                fireEvent.click(signInBtn)
                await screen.findByText("Dashboard")
                const helpCenterElement=await screen.findByText("Help Center")
                fireEvent.click(helpCenterElement)    
                await screen.findByText("Need Help or Assistance?") 
                const helpSubmitBtn=screen.getByTestId("submit-help-btn")                                     
                fireEvent.click(helpSubmitBtn)
                await waitFor(()=>screen.queryAllByText("Required"))
                const errors=screen.queryAllByText("Required")
                expect(errors.length).toBe(3)                                         
            })
            test("Name field is empty",async ()=>{
                renderApp()
                await screen.findByText("Sign In")
                const passwordInput = screen.getByTestId("password")
                const signInBtn = screen.getByTestId("sign-in-btn")
                fireEvent.change(passwordInput, { target: { value: "Tester" } })
                fireEvent.click(signInBtn)
                await screen.findByText("Dashboard")
                const helpCenterElement=await screen.findByText("Help Center")
                fireEvent.click(helpCenterElement)    
                await screen.findByText("Need Help or Assistance?") 
                const nameElement= screen.getByTestId("name") 
                const emailElement= screen.getByTestId("email")                        
                const problemElement= screen.getByTestId("problem")   
                const helpSubmitBtn=screen.getByTestId("submit-help-btn")                     
                fireEvent.change(nameElement,{ target: { value: "" } })                            
                fireEvent.change(emailElement,{ target: { value: "tester@test.com" } })            
                fireEvent.change(problemElement,{ target: { value: "this is a problem" } })                        
                fireEvent.click(helpSubmitBtn)
                await waitFor(()=>screen.queryByText("is-invalid"))
                expect(nameElement).toHaveClass("is-invalid")                                                      
            })
            test("Email field is empty",async ()=>{
                renderApp()
                await screen.findByText("Sign In")
                const passwordInput = screen.getByTestId("password")
                const signInBtn = screen.getByTestId("sign-in-btn")
                fireEvent.change(passwordInput, { target: { value: "Tester" } })
                fireEvent.click(signInBtn)
                await screen.findByText("Dashboard")
                const helpCenterElement=await screen.findByText("Help Center")
                fireEvent.click(helpCenterElement)    
                await screen.findByText("Need Help or Assistance?") 
                const nameElement= screen.getByTestId("name") 
                const emailElement= screen.getByTestId("email")                        
                const problemElement= screen.getByTestId("problem")   
                const helpSubmitBtn=screen.getByTestId("submit-help-btn")                     
                fireEvent.change(nameElement,{ target: { value: "Tester" } })  
                fireEvent.change(problemElement,{ target: { value: "this is a problem" } })                        
                fireEvent.click(helpSubmitBtn)
                await waitFor(()=>screen.queryByText("is-invalid"))
                expect(emailElement).toHaveClass("is-invalid")                          
            })   
            test("Problem field is empty",async ()=>{
                renderApp()
                await screen.findByText("Sign In")
                const passwordInput = screen.getByTestId("password")
                const signInBtn = screen.getByTestId("sign-in-btn")
                fireEvent.change(passwordInput, { target: { value: "Tester" } })
                fireEvent.click(signInBtn)
                await screen.findByText("Dashboard")
                const helpCenterElement=await screen.findByText("Help Center")
                fireEvent.click(helpCenterElement)    
                await screen.findByText("Need Help or Assistance?") 
                const nameElement= screen.getByTestId("name") 
                const emailElement= screen.getByTestId("email")                        
                const problemElement= screen.getByTestId("problem")   
                const helpSubmitBtn=screen.getByTestId("submit-help-btn")                     
                fireEvent.change(nameElement,{ target: { value: "Tester" } })  
                fireEvent.change(emailElement,{ target: { value: "tester@test.com" } })                            
                fireEvent.change(problemElement,{ target: { value: "" } })                        
                fireEvent.click(helpSubmitBtn)
                await waitFor(()=>screen.queryByText("is-invalid"))
                expect(problemElement).toHaveClass("is-invalid")                                          
            })         
        })            
    })
})