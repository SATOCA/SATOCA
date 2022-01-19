import { HistogramData } from "../../../../../DataModel/dto/CreateReportResponseDto";
import React, { useState } from "react";
import {
  Button,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { ExportToCsv } from "export-to-csv";
import { SurveyProgress } from "../../../../../DataModel/dto/SurveyProgressResponseDto";
import reportChart from "./ReportChart";

export default function DisplayReport(props: {
  scoringReport: HistogramData[];
  responseTimeReport: HistogramData[];
  surveyTitle: string;
  surveyProgress: SurveyProgress;
}) {
  const [activeTab, setActiveTab] = useState("1");
  const [csvExporter] = useState(
    new ExportToCsv({
      fieldSeparator: ";",
      // eslint-disable-next-line
      quoteStrings: `"`,
      decimalSeparator: ",",
      showLabels: true,
      showTitle: true,
      useTextFile: false,
      useBom: true,
    })
  );

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const exportScoringReport = (data: HistogramData[]) => {
    csvExporter.options.title = `Scoring_Report:; ${props.surveyTitle}; ${
      props.surveyProgress.finished
    }/${props.surveyProgress.total} (${(
      (props.surveyProgress.finished * 100) /
      props.surveyProgress.total
    ).toPrecision(3)}%)`;
    csvExporter.options.filename = `${props.surveyTitle}_Scoring_Report`;
    csvExporter.options.headers = ["scoring range", "user percentage"];
    csvExporter.generateCsv(JSON.parse(JSON.stringify(data)));
  };

  const exportResponseTimeReport = (data: HistogramData[]) => {
    csvExporter.options.title = `Response_Time_Report:; ${props.surveyTitle}; ${
      props.surveyProgress.finished
    }/${props.surveyProgress.total} (${(
      (props.surveyProgress.finished * 100) /
      props.surveyProgress.total
    ).toPrecision(3)}%)`;
    csvExporter.options.filename = `${props.surveyTitle}_Response_Time_Report`;
    csvExporter.options.headers = ["", ""];
    csvExporter.generateCsv(JSON.parse(JSON.stringify(data)));
  };

  return (
    <Container className="glass-card-content" fluid="lg">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            Participant Scoring
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            Average Response Time
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          {reportChart(props.scoringReport)}
          {props.scoringReport !== undefined &&
          props.scoringReport.length > 0 ? (
            <Button
              color="primary"
              onClick={() => {
                exportScoringReport(props.scoringReport);
              }}
            >
              Download Report
            </Button>
          ) : (
            <div />
          )}
        </TabPane>
        <TabPane tabId="2">
          {reportChart(props.responseTimeReport)}
          {props.responseTimeReport !== undefined &&
          props.responseTimeReport.length > 0 ? (
            <Button
              color="primary"
              onClick={() => {
                exportResponseTimeReport(props.responseTimeReport);
              }}
            >
              Download Report
            </Button>
          ) : (
            <div />
          )}
        </TabPane>
      </TabContent>
    </Container>
  );
}
