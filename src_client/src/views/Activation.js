import React from 'react'
import { Row, Col, Button, Container } from "reactstrap"
export default function Activation({ isMobile }) {
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
            <div style={{ textAlign: "center", width: "21vw" }}>
                <h2>Activating Elabox</h2>
                <p>Unlock rewards and premium support</p>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <Button style={{ padding: 10, width: 100 }} size="sm">Skip</Button>
                    <Button style={{ padding: 10, width: 100 }} color="success" size="sm" ><span>Activate Now</span></Button>
                </div>
            </div>
        </div >
    )
}
