const fs = require("fs")
const config = require("../config")
const auth = require("./auth")
const log = require("../logger")
const tmpWallet = "/tmp/wallet.dat"

// use to upload new keystore
function fromHex(hex = "", oldPass = "", newPass = "") {
    return new Promise( async (res, rej) => {
        log.write(log.create().info('uploading new keystore...'))
        let wallet = ""
        try {
            // STEP: authenticate pass
            await auth.authenticateWallet(oldPass)
            wallet = Buffer.from(hex, "hex").toString("utf8")
            const pwallet = JSON.parse(wallet)
            // STEP: validate content
            if (!pwallet || !pwallet.PasswordHash || !pwallet.Account) {
                rej(Error('Upload failed, invalid ela keystore.'))
                return
            }
        }catch(err) {
            log.write(log.create().error('upload keystore failed.', err))
            rej( err)
            return
        }

        // STEP: create a temp file for wallet
        fs.writeFile(tmpWallet, wallet, async (err) => {
            if (err) {
                log.write(log.create().error('upload keystore failed. tmp wallet write issue.', err))
                rej(err)
                return
            }
            try {
                // STEP: authenticate new pass
                await auth.authenticateWallet(newPass, tmpWallet)
            } catch (err) {
                log.write(log.create().error('upload keystore failed. new password is invalid', err))
                rej(Error('password for new wallet is invalid'))
                return
            }

            // STEP: change system password
            auth.changePassword(newPass)
                .then( _ => {
                    // FINAL: success, place the wallet
                    fs.writeFile(config.KEYSTORE_PATH, wallet, (err) => {
                        if (err) {
                            log.write(log.create().error('upload keystore failed. writing to keystore path issue.', err))
                            rej(err)
                            return
                        }
                        res()
                    })
                })
                .catch( err => {
                    log.write(log.create().error('upload keystore failed. changing password issue.', err))
                    rej(err)
                })
        })
    })
}

module.exports = {
    uploadFromHex : fromHex
}