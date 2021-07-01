import React from "react";
import "./Frontpage.css";
import StartButton from "./StartButton";
import UploadSurveyFile from "../TrusteeLogin/UploadSurveyFile/UploadSurveyFile";
import { Container, Row } from "reactstrap";

export default function Frontpage() {
  const clickMe = () => {
    console.log("Survey Started");
  };

  return (
    <div className="centered front-page-alignment">
      <Container>
        <Row>
          <StartButton onClick={clickMe} text="42">
            Exemplary Survey
          </StartButton>
        </Row>
        <Row>
          <UploadSurveyFile password="" login="" />
        </Row>
      </Container>
    </div>
  );
}
