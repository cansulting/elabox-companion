const ehandler = require('../helper/eventHandler');

const rewards = "ela.rewards"
const REGISTERDEVICE_ACTION = "ela.reward.actions.REGISTER_DEVICE"
const CHECK_DEVICE_ACTION = "ela.reward.actions.CHECK_DEVICE"

module.exports = {
    activateElabox: async (did) => { 
        const res = await ehandler.RPC(rewards, REGISTERDEVICE_ACTION, {did: did})
        return res
    },
    isElaboxActivated: async () => { 
        const res = await ehandler.RPC(rewards, CHECK_DEVICE_ACTION, {did: did})
        return res
    },
}