import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import {Nav, NavItem, NavLink} from "reactstrap";
import {Link} from "react-router-dom";

type State = {}
type Props = {
    text?: string,
    onClick: Function
}
export default class StartButton extends Component<Props, State> {
    render() {
        const { text,  onClick, children = 'Click' } = this.props
        const value = text || children
        return (
            <Button variant="success"  size="lg" onClick={(e) => onClick(e)}>
                <Nav>
                    <NavItem>
                        <NavLink className="NavbarText" tag={Link} to={"/test-survey/"+value}>
                            Start Survey
                        </NavLink>
                    </NavItem>
                </Nav>
            </Button>
        )
    }
}
