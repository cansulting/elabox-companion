import React from 'react'
import {Row,Col,Card,CardHeader} from "reactstrap"
export default function Updates({isMobile,ota}) {
    const {currentVersionDetails}=ota
    return (
        <div        
            style={{
            ...{
              paddingLeft: "18%",
              width: "100%",
              backgroundColor: "#1E1E26",
            },
            ...(isMobile && { paddingLeft: undefined }),
          }}
          className="animated fadeIn w3-container">
            <Row>
              <Col>
                <Card
                  style={{
                    backgroundColor: "#272A3D",
                    color: "white",
                    fontSize: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <CardHeader>Control your Elabox</CardHeader>
                </Card>
              </Col>
          </Row>            
        </div>
    )
}
