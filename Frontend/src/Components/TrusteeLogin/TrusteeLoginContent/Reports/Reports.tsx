import React, { useEffect, useState } from "react";
import DisplayReport from "./DisplayReport/DisplayReport";
import { Report } from "../../../../DataModel/dto/CreateReportResponseDto";
import SurveyApi from "../../../../Services/SurveyAPI";
import { AxiosError } from "axios";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "reactstrap";

export default function Reports(props: { password: string; login: string }) {
  const initialValue = [
    { id: 0, title: "", itemSeverityBoundary: 0, privacyBudget: 1.0 },
  ];

  const [reportData, setReportData] = useState<Report>({ histogramData: [] });
  const [privateData, setPrivateData] = useState<Report>({ histogramData: [] });
  const [surveyQuery, setSurveyQuery] = useState(initialValue);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState(
    "Select the query to show report"
  );
  const [selectedSurvey, setSurveyId] = useState(0);
  const [selectedSurveyPrivacy, setPrivacy] = useState(0);
  const [toggleState, toggleValue] = useState(false);
  const surveyApi = SurveyApi.getInstance();

  useEffect(() => {
    surveyApi
      .createReport(
        props.login,
        props.password,
        selectedSurvey,
        selectedSurveyPrivacy
      )
      .then(async (response) => {
        console.log(response);
        setReportData(response[0].report);
        setPrivateData(response[1].report);
        setHasError(false);
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });
    surveyApi
      .getSurveys(props.login, props.password, 1, 1)
      .then(async (response) => {
        console.log(response);
        setSurveyQuery(response.surveys.sort((lhs, rhs) => lhs.id - rhs.id));
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });
  }, [props.login, props.password, selectedSurvey, selectedSurveyPrivacy, surveyApi]);

  const setToggle = () => {
    toggleValue(!toggleState);
  };
  const setSurveyItem = (survey: number) => {
    setSurveyId(survey);
  };
  const dropDownElements = surveyQuery.map((survey) => (
    <DropdownItem
      onClick={() => {
        setSurveyItem(survey.id);
        setPrivacy(survey.privacyBudget);
        setDropDownTitle(
          `${survey.id}: ${survey.title}  participants finished: TODO?`
        );
      }}
    >
      Survey id:{survey.id} title:{survey.title}
    </DropdownItem>
  ));

  if (hasError) return <div>{errorMessage}</div>;

  return (
    <div>
      <div className="d-flex p-5">
        <Dropdown isOpen={toggleState} onClick={setToggle}>
          <DropdownToggle caret>{dropDownTitle}</DropdownToggle>
          <DropdownMenu>{dropDownElements}</DropdownMenu>
        </Dropdown>
      </div>
      <Row>
        <DisplayReport report={reportData} />
      </Row>
      <Row>
        <DisplayReport report={privateData} />
      </Row>
    </div>
  );
}
