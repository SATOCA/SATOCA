import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Header.css";

export default function Header() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <Navbar data-testid="navbar" className="App-header" dark>
      <NavbarBrand href="/" className="mr-auto">
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
            <NavLink className="NavbarText" tag={Link} to="/5/0c342361-c6f3-4af4-8d81-8e930c1a250d">
              Test Survey
          </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}
