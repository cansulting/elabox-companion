import React from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import elaboxLogo from "../../images/logo-wht.png";
import { useMediaQuery } from "react-responsive";

import { Navbar as NavB, Button } from "reactstrap";
const Navbar = ({ logOut, onMenuClick }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

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
        <Button onClick={logOut} color="danger">
          {isMobile ? <FiLogOut /> : "Log Out"}
        </Button>
      </NavB>
    </>
  );
};

export default Navbar;
