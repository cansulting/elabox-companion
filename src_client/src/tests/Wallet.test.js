import { fireEvent, screen } from "@testing-library/react"
import { server, rest, BASE_URL, renderApp,clearLocalStorage,renderAsFragment } from "../utils/testing"
import Wallet from "../views/Wallet"


beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe("Wallet", () => {
  test("renders correctly",()=>{
    const asFragment=renderAsFragment(Wallet)
    const html=asFragment()
    expect(html).toMatchSnapshot()
  })  
  describe("Wallet has valid elements Exists", () => {
    test("Send ELA Card", async () => {
      renderApp()


      await screen.findByText("Sign In")
      const passwordInput = screen.getByTestId("password")
      const signInBtn = screen.getByTestId("sign-in-btn")
      fireEvent.change(passwordInput, { target: { value: "Tester" } })
      fireEvent.click(signInBtn)   


      const walletElement = await screen.findByText("Wallet")
      fireEvent.click(walletElement)

      await screen.findByText("Send ELA")
      const recepientInput = screen.getByTestId("recipient")
      expect(recepientInput).toBeInTheDocument()  

      const amountInput = screen.getByTestId("amount")
      expect(amountInput).toBeInTheDocument()  

      const sendBtn = screen.getByTestId("send")
      expect(sendBtn).toBeInTheDocument()  



    })
 
  })
  test("Balance Card Elements Exists", async () => {
    renderApp()


    await screen.findByText("Sign In")
    const passwordInput = screen.getByTestId("password")
    const signInBtn = screen.getByTestId("sign-in-btn")
    fireEvent.change(passwordInput, { target: { value: "Tester" } })
    fireEvent.click(signInBtn)   
    const walletElement = await screen.findByText("Wallet")
    fireEvent.click(walletElement)
    await screen.findByText("Balance")
    const balanceCounter = screen.getByTestId("balance")
    expect(balanceCounter).toBeInTheDocument()
    const elaText = await screen.findByText("ELA")
    expect(elaText).toBeInTheDocument()


  })
  test("Recieve ELA Card Elements Exists", async () => {
    renderApp()
    await screen.findByText("Sign In")
    const passwordInput = screen.getByTestId("password")
    const signInBtn = screen.getByTestId("sign-in-btn")
    fireEvent.change(passwordInput, { target: { value: "Tester" } })
    fireEvent.click(signInBtn)   
    const walletElement = await screen.findByText("Wallet")
    fireEvent.click(walletElement)

    await screen.findByText("Receive ELA")
    const qrCodeCanvas = screen.getByTestId("qr-code")
    expect(qrCodeCanvas).toBeInTheDocument()
    const copyQRcode = screen.getByTestId("copy-qr")
    expect(copyQRcode).toBeInTheDocument()

  })
  test("Recent Transactions Table Elements exists", async () => {
    renderApp()
    await screen.findByText("Sign In")
    const passwordInput = screen.getByTestId("password")
    const signInBtn = screen.getByTestId("sign-in-btn")
    fireEvent.change(passwordInput, { target: { value: "Tester" } })
    fireEvent.click(signInBtn)   
    const walletElement = await screen.findByText("Wallet")
    fireEvent.click(walletElement)

    await screen.findByText("Recent transactions")
    const transactionsTable = screen.getByTestId("transactions-table")
    expect(transactionsTable).toBeInTheDocument()


  })

  test("Send ELA accepts valid QR Code", async () => {
    renderApp()
    await screen.findByText("Sign In")
    const passwordInput = screen.getByTestId("password")
    const signInBtn = screen.getByTestId("sign-in-btn")
    fireEvent.change(passwordInput, { target: { value: "Tester" } })
    fireEvent.click(signInBtn)   
    const walletElement = await screen.findByText("Wallet")
    fireEvent.click(walletElement)

    await screen.findByText("Send ELA")

    const recepientInput = screen.getByTestId("recipient")
    fireEvent.change(recepientInput, { target: { value: "Ec1pxaiYGjPyQ5fRQLwZpHwVUpYyss1ZBZ" } })

    const amountInput = screen.getByTestId("amount")
    fireEvent.change(amountInput, { target: { value: "1" } })

    const sendBtn = screen.getByTestId("send")
    fireEvent.click(sendBtn)  

    const sendingElaModal = await screen.findByText("Sending ELA")
    expect(sendingElaModal).toBeInTheDocument()


  })
  test("Send ELA doesn't accept ivalid QR Code", async () => {
    renderApp()
    await screen.findByText("Sign In")
    const passwordInput = screen.getByTestId("password")
    const signInBtn = screen.getByTestId("sign-in-btn")
    fireEvent.change(passwordInput, { target: { value: "Tester" } })
    fireEvent.click(signInBtn)   
    const walletElement = await screen.findByText("Wallet")
    fireEvent.click(walletElement)

    await screen.findByText("Send ELA")
    const recepientInput = screen.getByTestId("recipient")
    fireEvent.change(recepientInput, { target: { value: "invaliQR" } })
    const amountInput = screen.getByTestId("amount")
    fireEvent.change(amountInput, { target: { value: "1" } })
    const sendBtn = screen.getByTestId("send")
    fireEvent.click(sendBtn)  
    const sendingElaModal = await screen.findByText("Incorrect ELA Address")
    expect(sendingElaModal).toBeInTheDocument()


  })

  test("Send ELA accepts integer amount", async () => {
    renderApp()
    await screen.findByText("Sign In")
    const passwordInput = screen.getByTestId("password")
    const signInBtn = screen.getByTestId("sign-in-btn")
    fireEvent.change(passwordInput, { target: { value: "Tester" } })
    fireEvent.click(signInBtn)   
    const walletElement = await screen.findByText("Wallet")
    fireEvent.click(walletElement)

    await screen.findByText("Send ELA")

    const recepientInput = screen.getByTestId("recipient")
    fireEvent.change(recepientInput, { target: { value: "Ec1pxaiYGjPyQ5fRQLwZpHwVUpYyss1ZBZ" } })

    const amountInput = screen.getByTestId("amount")
    fireEvent.change(amountInput, { target: { value: "1" } })

    const sendBtn = screen.getByTestId("send")
    fireEvent.click(sendBtn)  

    const sendingElaModal = await screen.findByText("Sending ELA")
    expect(sendingElaModal).toBeInTheDocument()

})

test("Send ELA accepts float amount", async () => {
  renderApp()
  await screen.findByText("Sign In")
  const passwordInput = screen.getByTestId("password")
  const signInBtn = screen.getByTestId("sign-in-btn")
  fireEvent.change(passwordInput, { target: { value: "Tester" } })
  fireEvent.click(signInBtn)   
  const walletElement = await screen.findByText("Wallet")
  fireEvent.click(walletElement)

  await screen.findByText("Send ELA")

  const recepientInput = screen.getByTestId("recipient")
  fireEvent.change(recepientInput, { target: { value: "Ec1pxaiYGjPyQ5fRQLwZpHwVUpYyss1ZBZ" } })

  const amountInput = screen.getByTestId("amount")
  fireEvent.change(amountInput, { target: { value: "0.1" } })

  const sendBtn = screen.getByTestId("send")
  fireEvent.click(sendBtn)  

  const sendingElaModal = await screen.findByText("Sending ELA")
  expect(sendingElaModal).toBeInTheDocument()


})

test("Send ELA doesnt accept amount with comma(e.g 1,000)", async () => {
  renderApp()
  await screen.findByText("Sign In")
  const passwordInput = screen.getByTestId("password")
  const signInBtn = screen.getByTestId("sign-in-btn")
  fireEvent.change(passwordInput, { target: { value: "Tester" } })
  fireEvent.click(signInBtn)   
  const walletElement = await screen.findByText("Wallet")
  fireEvent.click(walletElement)

  await screen.findByText("Send ELA")

  const recepientInput = screen.getByTestId("recipient")
  fireEvent.change(recepientInput, { target: { value: "Ec1pxaiYGjPyQ5fRQLwZpHwVUpYyss1ZBZ" } })

  const amountInput = screen.getByTestId("amount")
  fireEvent.change(amountInput, { target: { value: "1,000" } })

  const sendBtn = screen.getByTestId("send")
  fireEvent.click(sendBtn)  

  const sendingElaModal = await screen.findByText("Error amount")
  expect(sendingElaModal).toBeInTheDocument()

})
test("Sending ELA modal has its elements", async () => {
  renderApp()
  await screen.findByText("Sign In")
  const passwordInput = screen.getByTestId("password")
  const signInBtn = screen.getByTestId("sign-in-btn")
  fireEvent.change(passwordInput, { target: { value: "Tester" } })
  fireEvent.click(signInBtn)   
  const walletElement = await screen.findByText("Wallet")
  fireEvent.click(walletElement)

  await screen.findByText("Send ELA")

  const recepientInput = screen.getByTestId("recipient")
  fireEvent.change(recepientInput, { target: { value: "Ec1pxaiYGjPyQ5fRQLwZpHwVUpYyss1ZBZ" } })

  const amountInput = screen.getByTestId("amount")
  fireEvent.change(amountInput, { target: { value: "1" } })

  const sendBtn = screen.getByTestId("send")
  fireEvent.click(sendBtn)


  await screen.findByText("Sending ELA")
  const sendingPasswordInput = screen.getByTestId("sending-ela-pasword")
  expect(sendingPasswordInput).toBeInTheDocument()
  const sendindElaSendBtn = screen.getByTestId("sending-ela-send-btn")
  expect(sendindElaSendBtn).toBeInTheDocument()
  const sendindElaCancelBtn = screen.getByTestId("sending-ela-cancel-btn")
  expect(sendindElaCancelBtn).toBeInTheDocument()

})
test("Sending ELA succeeds with valid inputs", async () => {
  server.use(
    rest.get(`${BASE_URL}/sendTx`, (req, res, ctx) => {
      return res(ctx.json({ ok: "ok" }))
    })
  )
  renderApp()
  await screen.findByText("Sign In")
  const passwordInput = screen.getByTestId("password")
  const signInBtn = screen.getByTestId("sign-in-btn")
  fireEvent.change(passwordInput, { target: { value: "Tester" } })
  fireEvent.click(signInBtn)   
  const walletElement = await screen.findByText("Wallet")
  fireEvent.click(walletElement)

  await screen.findByText("Send ELA")

  const recepientInput = screen.getByTestId("recipient")
  fireEvent.change(recepientInput, { target: { value: "Ec1pxaiYGjPyQ5fRQLwZpHwVUpYyss1ZBZ" } })

  const amountInput = screen.getByTestId("amount")
  fireEvent.change(amountInput, { target: { value: "1" } })

  const sendBtn = screen.getByTestId("send")
  fireEvent.click(sendBtn)

  await screen.findByText("Sending ELA")
  const sendingPasswordInput = screen.getByTestId("sending-ela-pasword")
  fireEvent.change(sendingPasswordInput, { target: { value: "Tester" } })

  const sendindElaSendBtn = screen.getByTestId("sending-ela-send-btn")
  fireEvent.click(sendindElaSendBtn)


  const sendingSuccess = await screen.findByText("Success")
  expect(sendingSuccess).toBeInTheDocument()


})

test("Sending ELA can fail with valid inputs if response is nope", async () => {
  server.use(
    rest.get(`${BASE_URL}/sendTx`, (req, res, ctx) => {
      return res(ctx.json({ ok: "nope" }))
    })
  )
  renderApp()
  await screen.findByText("Sign In")
  const passwordInput = screen.getByTestId("password")
  const signInBtn = screen.getByTestId("sign-in-btn")
  fireEvent.change(passwordInput, { target: { value: "Tester" } })
  fireEvent.click(signInBtn)   
  const walletElement = await screen.findByText("Wallet")
  fireEvent.click(walletElement)

  await screen.findByText("Send ELA")

  const recepientInput = screen.getByTestId("recipient")
  fireEvent.change(recepientInput, { target: { value: "Ec1pxaiYGjPyQ5fRQLwZpHwVUpYyss1ZBZ" } })

  const amountInput = screen.getByTestId("amount")
  fireEvent.change(amountInput, { target: { value: "1" } })

  const sendBtn = screen.getByTestId("send")
  fireEvent.click(sendBtn)

  await screen.findByText("Sending ELA")
  const sendingPasswordInput = screen.getByTestId("sending-ela-pasword")
  fireEvent.change(sendingPasswordInput, { target: { value: "Tester" } })

  const sendindElaSendBtn = screen.getByTestId("sending-ela-send-btn")
  fireEvent.click(sendindElaSendBtn)


  const sendingSuccess = await screen.findByText("Error")
  expect(sendingSuccess).toBeInTheDocument()


})

})