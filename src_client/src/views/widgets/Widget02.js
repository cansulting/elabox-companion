import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "reactstrap";
import {AiOutlineInfoCircle} from "react-icons/ai"
import classNames from "classnames";
import { mapToCssModules } from "reactstrap/lib/utils";

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  showInfo: PropTypes.func,
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
      showInfo=null,
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

    return (
      <Card style={{ backgroundColor: "#272A3D", marginBottom: "20px" }}>
        <CardBody>
          <div style={{position:"relative", paddingLeft: "20px", color: "white" }}>
            {showInfo && 
              <p style={{position:"absolute",right:-10,top:-20,marginLeft:2,fontSize:20 , marginBottom:3,padding:0, cursor: "pointer",color:"white"}}>
                <AiOutlineInfoCircle onClick={()=>{showInfo()}}/>
              </p> 
            }                            
            <img
              src={card.icon}
              style={{ widht: "60px", height: "60px", paddingRight: "20px" }}/>
            {color == "success" ? (
              <>
                <p
                  style={{
                    display: "inline",
                    color: "lightgreen",
                    fontSize: "14pt",
                    fontWeight: "bold",
                  }}
                >
                  <span>
                  {header} {initializing ? " (initializing) " : ""}
                </span>
                </p>
                <br />
                {children}
              </>
            ) : (
              <p
                style={{
                  display: "inline",
                  color: "red",
                  fontSize: "14pt",
                  fontWeight: "bold",
                }}
              >
                <span>
                  {header}                                                    
                </span>
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
