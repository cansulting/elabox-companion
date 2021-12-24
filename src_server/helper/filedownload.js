// handles file downloading given the url
const https = require("https")
const fs = require("fs")

module.exports = (url, destination = "", onProgress) => {
    return new Promise( (resolve, rej) => {
        // create subfolders
        const lastIndexPath = destination.lastIndexOf("/")
        if (lastIndexPath >= 0) {
            const parentFolder = destination.substring(0, lastIndexPath)
            console.log(parentFolder)
            if (!fs.existsSync(parentFolder) ) {
                fs.mkdirSync(parentFolder, {recursive: true})
            } 
        } 
        // download
        https.get(url, response => {
            let downloaded = 0
            let size = parseInt( response.headers["content-length"], 10)
            //console.log("Size", size)
            response.pipe(fs.createWriteStream(destination))
            response.on("data", (chunk) => {
                downloaded += chunk.length
                const progress = (downloaded/size) * 100
                onProgress(progress)
            })
            .on("close", () => {
                resolve()
            })
            .on("error", (err) => {
                rej(err)
            })
        })
    })
}