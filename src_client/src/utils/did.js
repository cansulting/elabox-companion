import { VerifiableCredential } from '@elastosfoundation/did-js-sdk';
import { connectivity, DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elabox/essentials-connector-client-browser';
let instance = null;
export default class Did {

    _initConnector() {
        console.log("initConnector")
        const connector = new EssentialsConnector()
        connectivity.registerConnector(connector)
        this.connector = connector
    }

    static getInstance() {
        if (!instance) {
            instance = new Did()
            instance._initConnector()
        }
        return instance 
    }

    async signin() {
        if (this.connector.hasWalletConnectSession())
            await this.connector.disconnectWalletConnect()
        const didAccess = new DID.DIDAccess()
        
        try {
            const presentation = await didAccess.requestCredentials(
                {claims: [DID.standardNameClaim("Activate elabox", false)]}
            );
            return presentation
        } catch (error) {
            console.log(error);
            return null
        }
        
    }

    disconnectConnector() {
        if (this.connector) {
            
            this.connector.disconnect()
            this.connector = null
        }
    }
}