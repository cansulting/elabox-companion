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
})