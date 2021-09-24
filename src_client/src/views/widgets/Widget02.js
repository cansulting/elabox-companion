import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardFooter } from "reactstrap";
import classNames from "classnames";
import { mapToCssModules } from "reactstrap/lib/utils";

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  footer: PropTypes.bool,
  link: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

class Widget02 extends Component {
  render() {
    const {
      className,
      cssModule,
      header,
      mainText,
      icon,
      color,
      footer,
      link,
      children,
      variant,
      initializing,
      ...attributes
    } = this.props;

    //demo purposes only
    const padding =
      variant === "0"
        ? { card: "p-3", icon: "p-3", lead: "mt-2" }
        : variant === "1"
        ? {
            card: "p-0",
            icon: "p-4",
            lead: "pt-3",
          }
        : { card: "p-0", icon: "p-4 px-5", lead: "pt-3" };

    const card = { style: "clearfix", color: color, icon: icon, classes: "" };
    card.classes = mapToCssModules(
      classNames(className, card.style, padding.card),
      cssModule
    );

    const lead = { style: "h5 mb-0", color: color, classes: "" };
    lead.classes = classNames(lead.style, "text-" + card.color, padding.lead);

    const blockIcon = function (icon) {
      const classes = classNames(
        icon,
        "bg-" + card.color,
        padding.icon,
        "font-2xl mr-3 float-left"
      );
      return <i className={classes}></i>;
    };

    const cardFooter = function () {
      if (footer) {
        return (
          <CardFooter className="px-3 py-2">
            <a
              className="font-weight-bold font-xs btn-block text-muted"
              href={link}
            >
              View More
              <i className="fa fa-angle-right float-right font-lg"></i>
            </a>
          </CardFooter>
        );
      }
    };

    return (
      <Card style={{ backgroundColor: "#272A3D", marginBottom: "20px" }}>
        <CardBody>
          <div style={{ paddingLeft: "20px", color: "white" }}>
            <img
              src={card.icon}
              style={{ widht: "60px", height: "60px", paddingRight: "20px" }}
            ></img>
            {color == "success" ? (
              <p
                style={{
                  display: "inline",
                  color: "lightgreen",
                  fontSize: "4",
                  fontWeight: "bold",
                }}
              >
                {header} {initializing ? " (initializing) " : ""}
                {children}
              </p>
            ) : (
              <p
                style={{
                  display: "inline",
                  color: "red",
                  fontSize: "14pt",
                  fontWeight: "bold",
                }}
              >
                {header}
                {children}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
}

Widget02.propTypes = propTypes;

export default Widget02;
