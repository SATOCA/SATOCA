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
              to="/login"
            >
              Trustee Login
            </NavLink>
            <NavItem>
            <NavLink tag={Link} to="/guide">
              How to use the Platform
            </NavLink>
          </NavItem>            
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}
