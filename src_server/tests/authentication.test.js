const { generateKeystore, changePassword, authenticate } = require("../utilities/auth.js")

jest.setTimeout(100000)
const validSpecialChars = "!@#%*_+\-=?~"

test("validate password", async () => {

    await authenticatePassword("elabox")
    .then( (res) => {
        expect(res).toBe(200)
    })
    .catch( err => {
        console.log(err)
        expect(err).toBeNull()
    })

})

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
        await generateKeystore(pass, true)
        .catch(err => {
            console.log(err)
            expect(err).toBeNull()
        })
        await authenticate(pass)
        .catch( err => {
            console.log(err)
            expect(err).toBeNull()
        })
    }
})


test("Generate keystore with long password", async () => {
    const pass = "$$$$sdfsdfasdfasdfasdfasdfasdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf234234234asdfaDDDFDSDFS443"
    generateKeystore(pass, true)
    .then( (res) => {
        console.log(res)
        authenticate(pass).catch( err => {
            expect(err).toBeNull()
        })
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