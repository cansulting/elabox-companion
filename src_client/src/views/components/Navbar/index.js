import React, { useState } from "react";
import {
  FiMenu,
  FiLogOut,
  FiAlignCenter,
  FiPower,
  FiRefreshCcw,
} from "react-icons/fi";
import elaboxLogo from "../../images/logo-wht.png";
import { useMediaQuery } from "react-responsive";

import {
  Navbar as NavB,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
const Navbar = ({ logOut, onMenuClick }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const handleDropDownToggle = () => {
    setIsDropdownOpen(!isDropDownOpen);
  };
  return (
    <>
      <NavB fixed="top" style={{ backgroundColor: "#1E1E26" }}>
        {isMobile && (
          <FiMenu
            color={"white"}
            size={"2em"}
            onClick={() => {
              onMenuClick((oldState) => !oldState);
            }}
          />
        )}
        <img
          className="align-middle"
          src={elaboxLogo}
          style={{ widht: "60px", height: "60px" }}
          alt={"Elabox Logo"}
        />
        <Dropdown isOpen={isDropDownOpen} toggle={handleDropDownToggle}>
          <DropdownToggle
            caret
            style={{ backgroundColor: "rgb(44, 113, 246)" }}
          >
            <FiAlignCenter /> Controls
          </DropdownToggle>
          <DropdownMenu
            className="nar-dropdown"
            dark
            style={{
              textAlign: "center",
              backgroundColor: "rgb(39, 42, 61)",
            }}
          >
            <DropdownItem onClick={logOut}>
              <FiLogOut /> Log Out
            </DropdownItem>
            <DropdownItem>
              <FiRefreshCcw /> Restart
            </DropdownItem>
            <DropdownItem>
              <FiPower /> Shut down
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* <Button onClick={logOut} color="danger">
          {isMobile ? <FiLogOut /> : "Log Out"}
        </Button> */}
      </NavB>
    </>
  );
};

export default Navbar;
