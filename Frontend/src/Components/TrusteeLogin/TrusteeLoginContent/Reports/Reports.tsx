import React, { useEffect, useState } from "react";
import DisplayReport from "./DisplayReport/DisplayReport";
import { HistogramData } from "../../../../DataModel/dto/CreateReportResponseDto";
import SurveyApi from "../../../../Services/SurveyAPI";
import { AxiosError } from "axios";
import {
  Alert,
  Badge,
  Button,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Progress,
  Row,
} from "reactstrap";
import { SurveyInfo } from "../../../../DataModel/dto/SurveyResponseDto";
import ErrorModal from "./ErrorModal/ErrorModal";
import AreYouSureModal from "./AreYouSureModal/AreYouSureModal";
import "./Reports.css";
import { SurveyProgress } from "../../../../DataModel/dto/SurveyProgressResponseDto";

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

  const [privateScoringData, setPrivateScoringData] = useState<HistogramData[]>(
    []
  );
  const [privateResponseTimeData, setprivateResponseTimeData] = useState<
    HistogramData[]
  >([]);
  const [surveyQuery, setSurveyQuery] = useState(initialValue);
  const [surveyProgress, setSurveyProgress] = useState<SurveyProgress>({
    finished: 0,
    total: 0,
  });
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [areYouSureCloseSurvey, setAreYouSureCloseSurvey] = useState(false);
  const [dropDownTitle, setDropDownTitle] = useState(
    "Select the query to show report"
  );
  const [selectedSurvey, setSurveyId] = useState(-1);
  const [selectedSurveyName, setSurveyName] = useState("default");
  const [isSurveyClosed, setIsSurveyClosed] = useState(false);
  const [toggleState, toggleValue] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const surveyApi = SurveyApi.getInstance();

  function updateSurveyDisplay() {
    surveyApi
      .getSurveys(props.login, props.password)
      .then(async (response) => {
        setSurveyQuery(response.surveys.sort((lhs, rhs) => lhs.id - rhs.id));
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });

    // only trigger Report creation, when Survey is selected
    if (selectedSurvey >= 0) {
      surveyApi
        .getSurveyProgress(props.login, props.password, selectedSurvey)
        .then(async (response) => {
          if (response.error.hasError) {
            alert(response.error.message);
          } else {
            setSurveyProgress(response.progress);
            setPercentage(
              (response.progress.finished * 100) / response.progress.total
            );
          }
        })
        .catch((error: AxiosError) => {
          setHasError(true);
          setErrorMessage(error.message);
        });
      if (isSurveyClosed) {
        surveyApi
          .getReports(props.login, props.password, selectedSurvey)
          .then(async (response) => {
            await setPrivateScoringData(response.scoringReport);
            await setprivateResponseTimeData(response.responseTimeReport);
            if (response.error.hasError) {
              alert(response.error.message);
            }
            setHasError(false);
          })
          .catch((error: AxiosError) => {
            setHasError(true);
            setErrorMessage(error.message);
          });
      }
    }
  }

  useEffect(() => {
    updateSurveyDisplay();
  }, [props.login, props.password, selectedSurvey, isSurveyClosed, surveyApi]); // eslint-disable-line react-hooks/exhaustive-deps

  const setToggle = () => {
    toggleValue(!toggleState);
  };

  const setSurveyItem = async (survey: SurveyInfo) => {
    setSurveyId(survey.id);
    await setSurveyName(survey.title);
    setIsSurveyClosed(survey.isClosed);
  };

  const dropDownElements = surveyQuery.map((survey) => (
    <DropdownItem
      onClick={async () => {
        await setSurveyItem(survey);
        setDropDownTitle(`${survey.id} | ${survey.title}`);
      }}
    >
      {`${survey.id} | ${survey.title}`}
    </DropdownItem>
  ));

  const progress = () => {
    let color = "danger";
    switch (true) {
      case percentage >= 90:
        color = "success";
        break;
      case percentage >= 60:
        color = "info";
        break;
      case percentage >= 30:
        color = "warning";
        break;
      default:
        break;
    }
    return (
      <div>
        <div className="text-center">
          Progress: {surveyProgress.finished}/{surveyProgress.total} (
          {percentage?.toPrecision(3)}
          %)
        </div>
        <Progress value={percentage?.toPrecision(3)} color={color} />
      </div>
    );
  };

  const surveyDisplay = () => {
    if (isSurveyClosed) {
      return (
        <>
          <Row>
            <h3>Report</h3>
          </Row>
          <Row>
            <Fade>
              <DisplayReport
                scoringReport={privateScoringData}
                responseTimeReport={privateResponseTimeData}
                surveyTitle={selectedSurveyName}
                surveyProgress={surveyProgress}
              />
            </Fade>
          </Row>
        </>
      );
    }
  };

  const closeSurveyClick = () => {
    setAreYouSureCloseSurvey(true);
  };

  const doNotCloseSurvey = () => {
    setAreYouSureCloseSurvey(false);
  };

  const closeSurvey = () => {
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
      })
      .finally(() => setAreYouSureCloseSurvey(false));
  };

  if (hasError) return <div>{errorMessage}</div>;

  return (
    <div>
      <ErrorModal hasError={hasError} errorMessage={errorMessage} />
      <AreYouSureModal
        modalOpen={areYouSureCloseSurvey}
        header="Are you sure?"
        bodyText={`Are you sure you want to close survey "${dropDownTitle}"`}
        yesButtonAction={closeSurvey}
        noButtonAction={doNotCloseSurvey}
      />
      <Container className="p-5">
        <Row className="row-margin">
          <Dropdown isOpen={toggleState} onClick={setToggle}>
            <DropdownToggle
              color="light"
              caret
              className="border-info rounded-pill"
            >
              <b>{dropDownTitle}</b>
            </DropdownToggle>
            <DropdownMenu>{dropDownElements}</DropdownMenu>
          </Dropdown>
        </Row>
        {selectedSurvey >= 0 ? (
          <Fade>
            <Alert color={isSurveyClosed ? "info" : "success"}>
              <h4 className="alert-heading">
                {" "}
                {isSurveyClosed ? (
                  <Badge color="info">🔒 SURVEY CLOSED </Badge>
                ) : (
                  <Badge color="success">
                    🔓 SURVEY OPEN <Badge color="success"> </Badge>
                    <Button color="danger" onClick={closeSurveyClick}>
                      CLOSE
                    </Button>
                  </Badge>
                )}{" "}
              </h4>
              {progress()}
              <hr />
            </Alert>
          </Fade>
        ) : (
          <div />
        )}
        <Row className="row-margin">{surveyDisplay()}</Row>
      </Container>
    </div>
  );
}
