import {EboxEvent} from "elabox-foundation"
export const ENABLE_ACTIVATION = true;
export const EboxEventInstance = new EboxEvent(window.location.hostname)
export const INSTALLER_PKID = "ela.installer"
export const SERVICE_ID = "ela.system"
export const ACCOUNT_PKID = "ela.account"
export const STORE_PKID = "ela.store"

// action ids
export const AC_AUTHENTICATE_DID = "account.actions.AUTH_DID"
export const AC_DID_SETUP_CHECK = "account.actions.DID_SETUP_CHECK" // use to check if did was setup to the device

//system ids
export const AC_DEVICE_SERIAL = "ela.system.DEVICE_SERIAL" //use to get serial