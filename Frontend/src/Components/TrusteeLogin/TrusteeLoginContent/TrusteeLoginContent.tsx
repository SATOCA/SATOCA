import UploadSurveyFile from "./UploadSurveyFile/UploadSurveyFile";
import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Reports from "./Reports/Reports";
import SurveyApi from "../../../Services/SurveyAPI";
import { SurveyInfo } from "../../../DataModel/dto/SurveyResponseDto";
import { AxiosError } from "axios";
import ErrorModal from "./Reports/ErrorModal/ErrorModal";

export default function TrusteeLoginContent(props: {
  login: string;
  password: string;
}) {
  const [activeTab, setActiveTab] = useState("1");
  const [surveyQuery, setSurveyQuery] = useState<SurveyInfo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const surveyApi = SurveyApi.getInstance();

  const surveyUploaded = () => {
    updateSurveyQuery();
  };

  function updateSurveyQuery() {
    surveyApi
      .getSurveys(props.login, props.password)
      .then(async (response) => {
        setSurveyQuery(response.surveys.sort((lhs, rhs) => lhs.id - rhs.id));
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });
  }

  useEffect(() => {
    updateSurveyQuery();
  }, [props.login, props.password, surveyApi]);

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Container className="glass-card-content" fluid="lg">
      <ErrorModal hasError={hasError} errorMessage={errorMessage} />
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            Upload new Survey
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            Existing Surveys
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <UploadSurveyFile
            login={props.login}
            password={props.password}
            surveyUploaded={surveyUploaded}
          />
        </TabPane>
        <TabPane tabId="2">
          <Reports
            login={props.login}
            password={props.password}
            surveyQuery={surveyQuery}
          />
        </TabPane>
      </TabContent>
    </Container>
  );
}
