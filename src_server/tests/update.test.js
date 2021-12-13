const filedownload = require("../helper/filedownload")
test("Elabox update test", ()=> {
    jest.setTimeout(20)
    filedownload(
        "https://storage.googleapis.com/elabox-staging/packages/3.box",
        "/tmp/ela/3.box",
        (progress) => {
            console.log("progress " + progress)
        }
    ).then(() => done())
    .catch( err => expect(err).toBe(null))
})