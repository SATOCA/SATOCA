import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Header.css";

export default function Header() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <Navbar data-testid="navbar" className="App-header" dark>
      <NavbarBrand href="/" className="mr-auto" data-testid="navbarBrand">
        Secure Adaptive Testing for Organized Capability Assessment
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={!collapsed} navbar>
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className="NavbarText"
              tag={Link}
              to="/5/ba1633d4-2729-47ac-ba89-fb362886b303"
            >
              Test Survey
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className="NavbarText"
              tag={Link}
              to="/login"
            >
              Trustee Login
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}
