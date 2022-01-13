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
import ErrorModal from "./ErrorModal/ErrorModal";
import AreYouSureModal from "./AreYouSureModal/AreYouSureModal";
import "./Reports.css";
import { ExportToCsv } from "export-to-csv";

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

  const [privateData, setPrivateData] = useState<Report>({ histogramData: [] });
  const [surveyQuery, setSurveyQuery] = useState(initialValue);
  const [surveyProgress, setSurveyProgress] = useState(0);
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
  }

  useEffect(() => {
    updateSurveyDisplay();
  }, [props.login, props.password, selectedSurvey, isSurveyClosed, surveyApi]); // eslint-disable-line react-hooks/exhaustive-deps

  const setToggle = () => {
    toggleValue(!toggleState);
  };

  const setOptionItem = (title: string, header: string[]) => {
    csvExporter.options.title = `${title}_report.csv`;
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

  const dropDownElements = surveyQuery.map((survey) => (
    <DropdownItem
      onClick={() => {
        setSurveyItem(survey);
        setOptionItem(survey.title, ["scoring range", "user percentage"]);
        setDropDownTitle(
          `[${survey.id}] ${
            survey.title
          }: survey progress ${surveyProgress.toPrecision(3)}%`
        );
      }}
    >
      Survey id:{survey.id} title:{survey.title}
    </DropdownItem>
  ));

  const surveyDisplay = () => {
    if (isSurveyClosed) {
      return (
        <Container className="p-5">
          <Row>
            <h1>Report</h1>
          </Row>
          <Row>
            <DisplayReport report={privateData} />
          </Row>
          {privateData.histogramData !== undefined &&
          privateData.histogramData.length > 0 ? (
            <Button color="primary" onClick={exportReport}>
              Download Report
            </Button>
          ) : (
            <div />
          )}
        </Container>
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
            <DropdownToggle caret>{dropDownTitle}</DropdownToggle>
            <DropdownMenu>{dropDownElements}</DropdownMenu>
          </Dropdown>
        </Row>
        {selectedSurvey >= 0 ? (
          <Row className="row-margin">
            <div className="closed-status-text">
              {isSurveyClosed ? "🔒 Survey closed" : "🔓 Survey open"}
            </div>
            {isSurveyClosed ? (
              <div />
            ) : (
              <Button color="primary" onClick={closeSurveyClick}>
                Close survey
              </Button>
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
