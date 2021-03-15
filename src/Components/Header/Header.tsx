import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import React from "react";
import "./Header.css";

export function Header() {
  return (
    <Navbar data-testid="navbar" className="App-header">
      <NavbarBrand tag={Link} to="/" data-testid="navbarBrand">
        Secure Adaptive Testing for Organized Capability Assessment
      </NavbarBrand>
      {/*<NavbarToggler onClick={toggle} />*/}
      {/*<Collapse isOpen={isOpen} navbar>*/}
      <Nav>
        <NavItem>
          <NavLink tag={Link} to="/">
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="NavbarText" tag={Link} to="/test-survey/42">
            Survey 3
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="NavbarText" tag={Link} to="/survey-end">
            Survey End
          </NavLink>
        </NavItem>
      </Nav>
      {/*</Collapse>*/}
    </Navbar>
  );
}
