import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./DisplayReport.css";
import CustomTooltip from "./CustomTooltip/CustomTooltip";
import { Report } from "../../../../../DataModel/dto/CreateReportResponseDto";
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
import { HistogramData } from "../../../../../../../Backend/src/routers/dto/CreateReportResponseDto";
import { ExportToCsv } from "export-to-csv";
import { SurveyProgress } from "../../../../../DataModel/dto/SurveyProgressResponseDto";

export default function DisplayReport(props: {
  scoringReport: Report;
  responseTimeReport: Report;
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

  const reportChart = (data: HistogramData[]) => (
    <div className="histogram">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 135,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            label={{
              value: "Scoring",
              position: "insideBottom",
              dy: 20,
            }}
            dataKey="bucketName"
          />
          <YAxis
            label={{
              value: "Ratio [in %] ",
              dx: -5,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="score" fill="#0055a2" label="Test" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

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
          {reportChart(props.scoringReport.histogramData)}
          {props.scoringReport.histogramData !== undefined &&
          props.scoringReport.histogramData.length > 0 ? (
            <Button
              color="primary"
              onClick={() => {
                exportScoringReport(props.scoringReport.histogramData);
              }}
            >
              Download Report
            </Button>
          ) : (
            <div />
          )}
        </TabPane>
        <TabPane tabId="2">
          {reportChart(props.responseTimeReport.histogramData)}
          {props.responseTimeReport.histogramData !== undefined &&
          props.responseTimeReport.histogramData.length > 0 ? (
            <Button
              color="primary"
              onClick={() => {
                exportResponseTimeReport(
                  props.responseTimeReport.histogramData
                );
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
