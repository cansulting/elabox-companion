import { fireEvent, screen, waitFor } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../testing/utils"
import Config from "./Config"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Config",()=>{
    test("renders correctly",()=>{
        const asFragment=renderAsFragment(Config)
        const html=asFragment()
        expect(html).toMatchSnapshot()
    })
    describe("Wallet",()=>{
        test("Able to create wallet",async ()=>{
              server.use(rest.get(`${BASE_URL}/checkInstallation`, (req, res, ctx) => {
                    return res(ctx.json({ configed: "false" }))
              }))
              jest.spyOn(window,'fetch')                            
              clearLocalStorage()
              renderApp()
              await screen.findByText("Welcome to Elabox")              
              const passwordInput=screen.getByTestId("password-input")
              const passwordConfirmInput=screen.getByTestId("password-confirm-input")
              const createWalletSubmitBtn=screen.getByTestId("create-wallet-submit-btn")
              fireEvent.change(passwordInput,{ target: { value: "Tester06" } })
              fireEvent.change(passwordConfirmInput,{ target: { value: "Tester06" } }) 
              fireEvent.click(createWalletSubmitBtn)
              expect(passwordInput.value).toBe(passwordConfirmInput.value)             
              expect(window.fetch).toHaveBeenCalledTimes(2)
        })
        test("Not able to create wallet",async ()=>{
            server.use(rest.get(`${BASE_URL}/checkInstallation`, (req, res, ctx) => {
                return res(ctx.json({ configed: "false" }))
          }))
          jest.spyOn(window, 'alert').mockImplementation(() => {});              
          clearLocalStorage()
          renderApp()
          await screen.findByText("Welcome to Elabox")              
          const passwordInput=screen.getByTestId("password-input")
          const passwordConfirmInput=screen.getByTestId("password-confirm-input")
          const createWalletSubmitBtn=screen.getByTestId("create-wallet-submit-btn")
          fireEvent.change(passwordInput,{ target: { value: "Testers06" } })
          fireEvent.change(passwordConfirmInput,{ target: { value: "Tester06220" } }) 
          fireEvent.click(createWalletSubmitBtn)
          //test if your password if not match         
          expect(passwordInput.value).not.toBe(passwordConfirmInput.value)           
          await waitFor(()=> expect(window.alert).toHaveBeenCalledWith("Your passwords do not match!"))
          //test if password if less than 8
          fireEvent.change(passwordInput,{ target: { value: "Test10" } })
          fireEvent.change(passwordConfirmInput,{ target: { value: "Test10" } }) 
          fireEvent.click(createWalletSubmitBtn)          
          await waitFor(()=> expect(window.alert).toHaveBeenCalledWith("Password has to be at least 8 characters long"))          
          expect(window.alert).toHaveBeenCalled()                      
        })
    })

})