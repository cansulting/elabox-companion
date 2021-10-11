import { fireEvent, screen } from "@testing-library/react"
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
})