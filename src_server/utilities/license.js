const ehandler = require('../helper/eventHandler');

const rewards = "ela.rewards"
const REGISTERDEVICE_ACTION = "ela.reward.actions.REGISTER_DEVICE"
const CHECK_DEVICE_ACTION = "ela.reward.actions.CHECK_DEVICE"

module.exports = {
    activateElabox: async (did) => { 
        const res = await ehandler.eboxEventInstance.sendRPC(rewards, REGISTERDEVICE_ACTION, "",{did: did})
        if (res.code !== 200) 
            throw res
        return "activate success"
    },
    isElaboxActivated: async () => { 
        const res = await ehandler.eboxEventInstance.sendRPC(rewards, CHECK_DEVICE_ACTION)
        //console.log("isactivated", res)
        if (res.code !== 200) 
            throw res
        let activated = true
        if (res.message !== "registered")
            activated = false
        return activated
    },
}