import React from "react";
import "./Frontpage.css"
import StartButton from "./StartButton";
import {ButtonDropdown, ButtonGroup, ButtonToolbar, Nav, NavItem, NavLink} from "reactstrap";
import {DisplayRadioButtons} from "../SurveyComponent/DisplayItem/Answer/DisplayRadioButtons";
import {Link} from "react-router-dom";

export default function Frontpage() {
    const clickMe = () => {
    console.log("Survey Started");
};
  return (
    <div className="centered front-page-alignment">
        <StartButton onClick={clickMe}>42</StartButton>
    </div>
  );
}
