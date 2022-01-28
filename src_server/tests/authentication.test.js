const { generateKeystore, changePassword } = require("../device_setup.js")

jest.setTimeout(3000)
test("change password: throw error for special characters", async () => {
    changePassword("$$$$$$$$$$$$$$")
    .then( (res) => {
        console.log(res)
        expect(res).toBeNull()
    }).catch(err => {
        console.log(err)
        expect(err).not.toBeNull()
    })
})
test("Generate keystore with long password", async () => {
    generateKeystore("sdfsdfasdfasdfasdfasdfasdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf234234234asdfaDDDFDSDFS443", true)
    .then( (res) => {
        console.log(res)
        expect(res).not.toBeNull()
    }).catch(err => {
        console.log(err)
        expect(err).toBeNull()
    })
})

test("Generate keystore failure on special character", async () => {
    generateKeystore("$$$$$$$$$$$$$$", true)
    .then( (res) => {
        console.log(res)
        expect(res).toBeNull()
    }).catch(err => {
        console.log(err)
        expect(err).not.toBeNull()
    })
})

test("Generate password and keystore with valid values", async () => {
    generateKeystore("elabox", true)
    .then( (res) => {
        console.log(res)
        changePassword("elabox")
        .then( (res) => {
            console.log(res)
            expect(res).not.toBeNull()
        }).catch(err => {
            console.log(err)
            expect(err).toBeNull()
        })
    }).catch(err => {
        console.log(err)
        expect(err).toBeNull()
    })
})