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
} from "reactstrap";

enum ReportDisplay {
  SelectQueries,
  ShowReport,
}

export default function Reports(props: { password: string; login: string }) {
  const initialValue = [
    { id: 0, title: "", itemSeverityBoundary: 0, privacyBudget: 1.0 },
  ];

  const [activeTab, setActiveTab] = useState(ReportDisplay.SelectQueries);
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
        setPrivateData(response.report);
        if (response.error.hasError) {
          alert(response.error.message);
        }
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
        setSurveyQuery(response.surveys.sort((a, b) => a.id - b.id));
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });
  }, [props.login, props.password, selectedSurvey]);

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
  const toggleView = () => {
    if (activeTab === ReportDisplay.SelectQueries)
      setActiveTab(ReportDisplay.ShowReport);
    else setActiveTab(ReportDisplay.SelectQueries);
  };

  if (hasError) return <div>{errorMessage}</div>;

  return (
    <div>
      <div className="d-flex p-5">
        <Dropdown isOpen={toggleState} onClick={setToggle}>
          <DropdownToggle caret>{dropDownTitle}</DropdownToggle>
          <DropdownMenu>{dropDownElements}</DropdownMenu>
        </Dropdown>
      </div>
      <DisplayReport report={privateData} />
    </div>
  );
}
