import React, { Component } from "react";
import { Button, Row, Col, Card, CardBody } from "reactstrap";

// const propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string,
//   cssModule: PropTypes.object,
//   dataBox: PropTypes.func,
// };

const defaultProps = {
  dataBox: () => ({ variant: "facebook", friends: "-", feeds: "-" }),
  disabledButton: false,
};

class Widget05 extends Component {
  // constructor(props){
  //   super(props)
  // }

  render() {
    // eslint-disable-next-line
    const { children, className, cssModule, dataBox, ...attributes } =
      this.props;

    // demo purposes only
    const data = dataBox();
    const variant = data.variant;
    // const title = data.title;
    if (
      !variant ||
      ["facebook", "twitter", "linkedin", "google-plus"].indexOf(variant) < 0
    ) {
      return null;
    }

    // const back = "bg-" + variant;
    // const icon = "fa fa-" + variant;
    // const keys = Object.keys(data);
    const vals = Object.values(data);

    // const classCard = "brand-card";
    // const classCardHeader = classNames(`${classCard}-header`, back);
    // const classCardBody = classNames(`${classCard}-body`);
    // const classes = mapToCssModules(
    //   classNames(classCard, className),
    //   cssModule
    // );

    return (
      <Card
        style={{
          backgroundColor: "#272A3D",
          color: "white",
          margin: "0.5em 0 0.5em 0",
        }}
      >
        <CardBody>
          <Row style={{ height: "70px" }}>
            <Col style={{ display: "flex", justifyContent: "center" }}>
              {data.title}
            </Col>
          </Row>

          {vals[3] !== "" ? (
            <Row>
              <Col xs="6" style={{ justifyContent: "center", display: "flex" }}>
                <Button onClick={this.props.onGreenPress} color="success">
                  {vals[2]}
                </Button>
              </Col>
              <Col xs="6" style={{ justifyContent: "center", display: "flex" }}>
                <Button onClick={this.props.onRedPress} color="danger">
                  {vals[3]}
                </Button>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col
                xs="12"
                style={{ justifyContent: "center", display: "flex" }}
              >
                <Button
                  disabled={this.props.disabledButton}
                  onClick={this.props.onGreenPress}
                  color="success"
                >
                  {vals[2]}
                </Button>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    );
  }
}

Widget05.defaultProps = defaultProps;

export default Widget05;
