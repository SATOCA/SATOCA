import { HistogramData } from "../../../../../DataModel/dto/CreateReportResponseDto";
import React, { useState } from "react";
import { Button, Container } from "reactstrap";
import { ExportToCsv } from "export-to-csv";
import { SurveyProgress } from "../../../../../DataModel/dto/SurveyProgressResponseDto";
import ReportChart from "./ReportChart";
import BehaviorTooltip from "./Tooltips/BehaviorTooltip";
import ScoringTooltip from "./Tooltips/ScoringTooltip";

export default function DisplayReport(props: {
  scoringReport: HistogramData[];
  responseTimeReport: HistogramData[];
  surveyTitle: string;
  surveyProgress: SurveyProgress;
}) {
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
      <h1>Participant Scoring</h1>

      <ReportChart
          data={props.scoringReport}
          xAxisLabel="Scoring"
          tooltip={<ScoringTooltip />} />
      {props.scoringReport !== undefined && props.scoringReport.length > 0 ? (
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

      <h1>Average Response Time</h1>
      <ReportChart
        data={props.responseTimeReport}
        xAxisLabel="Time needed [in ms]"
        tooltip={<BehaviorTooltip />}
      />
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
    </Container>
  );
}
