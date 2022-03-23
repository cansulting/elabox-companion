import backend from "../api/backend"
import DID from "./did"

export const isActivated = async () => {
    const res = await backend.isElaboxActivated()
}

export const activateLicense = async () => {
    const did = await DID.getInstance().signin()
    //const did = "asdfsadf"
    const res = await backend.activateElabox(did)
}