import React, { useEffect, useState } from "react";
import DisplayReport from "./DisplayReport/DisplayReport";
import { Report } from "../../../../DataModel/dto/CreateReportResponseDto";
import SurveyApi from "../../../../Services/SurveyAPI";
import { AxiosError } from "axios";
import {
  Button,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "reactstrap";
import { SurveyInfo } from "../../../../DataModel/dto/SurveyResponseDto";

export default function Reports(props: { password: string; login: string }) {
  const initialValue: SurveyInfo[] = [
    {
      id: -1,
      title: "",
      itemSeverityBoundary: 0,
      privacyBudget: 1.0,
      isClosed: false,
    },
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
  const [isSurveyClosed, setIsSurveyClosed] = useState(false);
  const [toggleState, toggleValue] = useState(false);
  const surveyApi = SurveyApi.getInstance();

  function updateSurveyDisplay() {
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
      .getSurveys(props.login, props.password)
      .then(async (response) => {
        console.log(response);
        setSurveyQuery(response.surveys.sort((lhs, rhs) => lhs.id - rhs.id));
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });
  }

  useEffect(() => {
    updateSurveyDisplay();
  }, [
    props.login,
    props.password,
    selectedSurvey,
    selectedSurveyPrivacy,
    surveyApi,
  ]);

  const setToggle = () => {
    toggleValue(!toggleState);
  };
  const setSurveyItem = (survey: SurveyInfo) => {
    setSurveyId(survey.id);
    setPrivacy(survey.privacyBudget);
    setIsSurveyClosed(survey.isClosed);
  };

  const dropDownElements = surveyQuery.map((survey) => (
    <DropdownItem
      onClick={() => {
        setSurveyItem(survey);
        setDropDownTitle(
          `${survey.id}: ${survey.title}  participants finished: TODO?`
        );
      }}
    >
      Survey id:{survey.id} title:{survey.title}
    </DropdownItem>
  ));

  const surveyDisplay = () => {
    if (isSurveyClosed) {
      return (
        <Row>
          <DisplayReport report={privateData} />
        </Row>
      );
    }
  };

  const closeSurveyClick = () => {
    surveyApi
      .closeSurvey(props.login, props.password, selectedSurvey)
      .then((response) => {
        if (response.error.hasError) {
          setHasError(true);
          setErrorMessage(response.error.message);
        } else {
          setIsSurveyClosed(true);
          updateSurveyDisplay();
        }
      });
  };

  if (hasError) return <div>{errorMessage}</div>;

  return (
    <div>
      <Container className="p-5">
        <Row>
          <Dropdown isOpen={toggleState} onClick={setToggle}>
            <DropdownToggle caret>{dropDownTitle}</DropdownToggle>
            <DropdownMenu>{dropDownElements}</DropdownMenu>
          </Dropdown>
        </Row>
        {selectedSurvey >= 0 ? (
          <Row>
            <p>{isSurveyClosed ? "Survey closed" : "Survey open"}</p>
            {isSurveyClosed ? (
              <div />
            ) : (
              <Button onClick={closeSurveyClick}>Close survey</Button>
            )}
          </Row>
        ) : (
          <div />
        )}
      </Container>
      {surveyDisplay()}
    </div>
  );
}
