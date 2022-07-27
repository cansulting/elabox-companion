import { ACCOUNT_PKID, AC_DEVICE_SERIAL, EboxEventInstance } from "../config";

export const getSerial = async () =>{
    try{
        const res = await EboxEventInstance.sendRPC(ACCOUNT_PKID, AC_DEVICE_SERIAL)
        if (res.code === 200) {
            // console.log("signin error", res)
            // throw res
            res.message = JSON.parse(res.message)
        }
        return res.message.Serial   
    }
    catch (error) {
        return error
    }
}