import * as ebox from "elabox-dapp-store.lib"

ebox.initialize()

const dappStore = (props) => {
    retrieveAllListings()   
    return (
        <div>
            <h1>Dapp Store</h1>
            <p>
                This is a demo of the Dapp Store.
            </p>
            <ebox.AppDashboardCon/>
        </div>
    )
}

export default dappStore