import backend from "../api/backend"
import DID from "./did"

// return true or false if activated
export const isActivated = async () => {
    const res = await backend.isElaboxActivated()
    //console.log(res)
    return res.activated
}

export const activateLicense = async () => {
    const did = await DID.getInstance().request()
    //const did = "asdfsadf"
    if (did && did.holder) {
        const holder = did.holder.toJSON()
        const res = await backend.activateElabox(holder)
        return res 
    } 
    return null
}