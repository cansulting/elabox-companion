import React from "react"
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap"
export default function Updates({ isMobile, ota }) {
  const { currentVersionDetails } = ota
  console.log(currentVersionDetails)
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
      className="animated fadeIn w3-container"
    >
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
            <CardHeader>Installed Version</CardHeader>
            <CardBody>
              <p>Name: {currentVersionDetails.name}</p>
              <p>Version: {currentVersionDetails.version}</p>
              <p>{currentVersionDetails.description}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
