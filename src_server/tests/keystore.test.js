const {uploadFromHex} =require("../utilities/keystore.js");
const {KEYSTORE_PATH} = require("../config")
const fsExtra=require("fs-extra")
const minimist=require("minimist")
const password=minimist(process.argv.slice(2))["password"];
jest.setTimeout(100000)


test("wrong keyfile", async ()=>{
    const wallet= Buffer.from("wrong file").toString('hex') 
    await uploadFromHex(wallet, password, password).catch( err => {
        expect(err).not.toBeNull()
        expect(err.message).toContain("invalid password")
    })
})
test("Wrong keystore password",async()=>{
    const wallet=fsExtra.readFileSync(KEYSTORE_PATH)
    const wrongpass="thisiswrongpassword"
    await uploadFromHex(wallet, password, wrongpass).catch( err => {
        expect(err).not.toBeNull()
        expect(err.message).toContain("invalid password")
    })    
})
test("success uploading",async ()=>{
    const wallet = fsExtra.readFileSync(KEYSTORE_PATH)
    await uploadFromHex(wallet, password, password).then(_=>{
        expect(true).toBe(true)
    }).catch( err => {
        expect(err).toBeNull()
    })        
})