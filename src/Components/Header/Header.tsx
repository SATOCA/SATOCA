import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import React from "react";

export function Header() {
  return (
    <Navbar data-testid="navbar" className="App-header">
      <NavbarBrand tag={Link} to="/" data-testid="navbarBrand">
        Secure Adaptive Testing for Organized Capability Assessment
      </NavbarBrand>
      <Nav>
        <NavItem>
          <NavLink tag={Link} to="/">
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/3">
            Survey 3
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/survey-end">
            Survey End
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
}
