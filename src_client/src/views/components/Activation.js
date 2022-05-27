
// this displays the license activation page

import React, { useState } from 'react'
import * as Icon from "react-feather"
import { Button, Table, Modal , ModalHeader , ModalBody, Spinner } from "reactstrap"
import { activateLicense } from '../../utils/license'
export default function Activation({ isMobile, isOpen, closeActivation , isModal = true}) {
    const [currentPage, setCurrentPage] = useState(0)
    const [activateRes, setActivateRes] = useState(null)
    const [loading, setLoading] = useState(false)
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1)
    }
    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1)
    }
    const handleCloseActivation=(success=false)=>{
        setCurrentPage(0)
        if (typeof success !== 'boolean')
            success = false
        closeActivation(success)
        console.log(success)
    } 
    // on activate button was pressed
    const handleActivate=async ()=>{
        setLoading(true)
        let res = await activateLicense()
        setLoading(false)
        if (res) {
            res = {...res, onClick: () => {
                handleCloseActivation(res.activated)
                setActivateRes(null)
            }} 
            setActivateRes(res)
        }
    }
    if(!isModal){
        if (loading)
            return <ActivationLoading/>
        if (!activateRes) {
            return <ActivationBody 
                    isMobile={isMobile} 
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    handleCloseActivation={handleCloseActivation}
                    handleActivate={handleActivate}
                    currentPage={currentPage} />         
        }
        return <ActivationResult {...activateRes}/>
    }
    return ( 
        <Modal isOpen={isOpen} centered>
            <ModalBody style={{padding:"60px"}}>
                {!loading && !activateRes && <ActivationBody 
                    isMobile={isMobile} 
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                    handleCloseActivation={handleCloseActivation}
                    handleActivate={handleActivate}
                    currentPage={currentPage} />}
                {!loading && activateRes && 
                    <ActivationResult {...activateRes}/>
                }
                {loading && <ActivationLoading/>}
            </ModalBody>
        </Modal>
    )
}

const Frame = ({isMobile, children}) => {
    return (<div
        style={{
            ...{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                color: "white"
            },
            ...(isMobile && { paddingLeft: undefined }),
        }}>
            <div style={{ textAlign: "center", width: `${isMobile ? "80vw" : "45vw"}` }}>
                {children}
            </div>
    </div>)
}

const ActivationLoading = ({}) => {
    return (<Frame>
        <Spinner color="light" type="grow">Loading</Spinner>
        <Spinner color="light" type="grow">Loading</Spinner>
        <Spinner color="light" type="grow">Loading</Spinner>
    </Frame>)
}

const ActivationResult = ({activated, error, onClick}) => {
    return (
        <Frame>
        <div className="animated fadeIn w3-container">
            {activated && <>
                <h2>License Activated</h2>
            </>}
            {!activated && <>
                <h2>Activation Failed</h2>
                {error && <p>{error}</p>}
                {!error && <p>Please try again later.</p>}
            </>}
            <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
                <Button style={{ padding: 10, width: 100, margin: 10 }} color="success" size="sm" onClick={onClick}>
                    Ok
                </Button>
            </div>
        </div>
        </Frame>
    )
}

const ActivationBody=({
    isMobile,
    handleNextPage,
    handlePrevPage,
    handleCloseActivation,
    currentPage, 
    handleActivate,
})=>{
    return (<Frame>
            {currentPage === 0 ? 
                <ActivatePage handleNextPage={handleNextPage} handleActivate={handleActivate}/> 
                : 
                <PurchasePage handlePrevPage={handlePrevPage} handleCloseActivation={handleCloseActivation} />}
        </Frame>)   
}
const ActivatePage = ({ handleNextPage, handleActivate }) => {
    return <div className="animated fadeIn w3-container">
        <h2>Activate Elabox</h2>
        <p>Unlock rewards and premium support</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
            <Button style={{ padding: 10, width: 100 }} size="sm" onClick={handleNextPage}>
                Skip
            </Button>
            <Button style={{ padding: 10, width: 100 }} color="success" size="sm" onClick={handleActivate}>
                Activate Now
            </Button>
        </div>
    </div>
}
const PurchasePage = ({ handlePrevPage , handleCloseActivation }) => {
    return <div className="animated fadeIn w3-container">
        <Table style={{ color: "white" }} size="sm" borderless >
            <thead>
                <th> </th>
                <th>Free</th>
                <th>Premium</th>
            </thead>
            <tbody>
                <tr>
                    <td style={{ paddingRight: 30 }}>Nodes(Mainchain,ESC,DID)</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                </tr>
                <tr>
                    <td>dApps</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                </tr>
                <tr>
                    <td>dApps services</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                </tr>
                <tr>
                    <td>Premium Support</td>
                    <td>{<Icon.XCircle height={20} width={20} color="red" />}</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                </tr>
                <tr>
                    <td>Rewards</td>
                    <td>{<Icon.XCircle height={20} width={20} color="red" />}</td>
                    <td>{<Icon.CheckCircle height={20} width={20} color="green" />}</td>
                </tr>
            </tbody>
        </Table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 100 }}>
            <div style={{ display: "inline-block", cursor: "pointer" }} onClick={handlePrevPage}> <Icon.ArrowLeft /> Back</div>
            <div>
                <Button style={{ padding: 10, width: 120, marginRight: 5 }} size="sm" onClick={handleCloseActivation}>
                    Later
                </Button>
                <Button style={{ padding: 10, width: 120 }} color="success" size="sm">
                    Purchase Now
                </Button>
            </div>

        </div>
    </div>
}
