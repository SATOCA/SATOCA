import React, { useEffect, useState } from "react";
import DisplayReport from "./DisplayReport/DisplayReport";
import { Report } from "../../../../DataModel/dto/CreateReportResponseDto";
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
import { ExportToCsv } from "export-to-csv";
import { SurveyProgress } from "../../../../DataModel/dto/SurveyProgressResponseDto";

export default function Reports(props: {
  password: string;
  login: string;
  surveyQuery: SurveyInfo[];
}) {
  const [privateData, setPrivateData] = useState<Report>({ histogramData: [] });

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
  const [selectedSurveyPrivacy, setPrivacy] = useState(0);
  const [isSurveyClosed, setIsSurveyClosed] = useState(false);
  const [toggleState, toggleValue] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [csvExporter] = useState(
    new ExportToCsv({
      fieldSeparator: ";",
      // eslint-disable-next-line
      quoteStrings: `"`,
      decimalSeparator: ",",
      showLabels: true,
      showTitle: true,
      title: "_Report.csv",
      filename: "_Report",
      useTextFile: false,
      useBom: true,
      headers: ["scoring range", "user percentage"],
    })
  );
  const surveyApi = SurveyApi.getInstance();

  useEffect(() => {
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
            .createReport(
                props.login,
                props.password,
                selectedSurvey,
                selectedSurveyPrivacy
            )
            .then(async (response) => {
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
      }
    }
  }, [props.login, props.password, selectedSurvey, isSurveyClosed, surveyApi]);

  const setToggle = () => {
    toggleValue(!toggleState);
  };

  const setOptionItem = (title: string, header: string[]) => {
    csvExporter.options.title = `SCORING-REPORT - SURVEY: ${title}   PARTICIPATION: ${
      surveyProgress.finished
    }/${surveyProgress.total} (${percentage.toPrecision(3)}%)`;
    csvExporter.options.filename = `${title}_report`;
    csvExporter.options.headers = header;
  };

  const setSurveyItem = (survey: SurveyInfo) => {
    setSurveyId(survey.id);
    setPrivacy(survey.privacyBudget);
    setIsSurveyClosed(survey.isClosed);
  };
  const exportReport = () => {
    csvExporter.generateCsv(
      JSON.parse(JSON.stringify(privateData.histogramData))
    );
  };

  const dropDownElements = props.surveyQuery.map((survey) => (
    <DropdownItem
      onClick={() => {
        setSurveyItem(survey);
        setOptionItem(survey.title, ["scoring range", "user percentage"]);
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
              <DisplayReport report={privateData} />
            </Fade>
          </Row>
          {privateData.histogramData !== undefined &&
          privateData.histogramData.length > 0 ? (
            <Button color="primary" onClick={exportReport}>
              Download Report
            </Button>
          ) : (
            <div />
          )}
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
