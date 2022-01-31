const { generateKeystore, changePassword } = require("../utilities/auth.js")

jest.setTimeout(3000)
const validSpecialChars = "!@#%*_+\-='\"?~$"

test("change password: should accept special characters limited to " + validSpecialChars, async () => {
    for (let index = 0; index < validSpecialChars.length; index++) {
        const character = validSpecialChars[index];
        const pass = "helloworld" + character
        console.log('checking pass ' + pass)
        changePassword(pass)
        .catch(err => {
            console.log(err)
            expect(err).toBeNull()
        })
    }
})

test("generate keystore: should accept special characters limited to " + validSpecialChars, async () => {
    for (let index = 0; index < validSpecialChars.length; index++) {
        const character = validSpecialChars[index];
        const pass = "helloworld" + character
        console.log('checking pass ' + pass)
        generateKeystore(pass)
        .catch(err => {
            console.log(err)
            expect(err).toBeNull()
        })
    }
})


test("Generate keystore with long password", async () => {
    generateKeystore("$$$$sdfsdfasdfasdfasdfasdfasdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf234234234asdfaDDDFDSDFS443", true)
    .then( (res) => {
        console.log(res)
        expect(res).not.toBeNull()
    }).catch(err => {
        console.log(err)
        expect(err).toBeNull()
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