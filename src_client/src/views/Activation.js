import React, { useState } from 'react'
import { Link, useHistory } from "react-router-dom"
import * as Icon from "react-feather"
import { Button, Table } from "reactstrap"
export default function Activation({ isMobile }) {
    const [currentPage, setCurrentPage] = useState(0)
    const history = useHistory();
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1)
    }
    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1)
    }
    return (
        <div style={{
            ...{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "18%",
                width: "100%",
                height: "90vh",
                backgroundColor: "#1E1E26",
                color: "white"
            },
            ...(isMobile && { paddingLeft: undefined }),
        }}>
            <div style={{ textAlign: "center", width: `${isMobile ? "80vw" : "45vw"}` }}>
                {currentPage === 0 ? <ActivatePage handleNextPage={handleNextPage} /> : <PurchasePage handlePrevPage={handlePrevPage} />}
            </div>

        </div >
    )
}
const ActivatePage = ({ handleNextPage }) => {
    return <>
        <h2>Activating Elabox</h2>
        <p>Unlock rewards and premium support</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
            <Link to="/">
                <Button style={{ padding: 10, width: 100 }} size="sm">Skip</Button>
            </Link>
            <Button style={{ padding: 10, width: 100 }} color="success" size="sm" onClick={handleNextPage} >Activate Now</Button>
        </div>
    </>
}
const PurchasePage = ({ handlePrevPage }) => {
    return <>
        <Table style={{ color: "white" }} size="sm" borderless >
            <thead>
                <th></th>
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
                    <td>{<Icon.XCircle height={20} width={20} color="red" />}</td>
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
                <Link to="/">
                    <Button style={{ padding: 10, width: 120, marginRight: 5 }} size="sm">Later</Button>
                </Link>
                <Button style={{ padding: 10, width: 120 }} color="success" size="sm">Purchase Now</Button>
            </div>

        </div>
    </>
}
