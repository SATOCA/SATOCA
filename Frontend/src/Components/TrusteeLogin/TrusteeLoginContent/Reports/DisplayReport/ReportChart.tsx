import { HistogramData } from "../../../../../DataModel/dto/CreateReportResponseDto";
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
import "./ReportChart.css";
import React, { ReactElement } from "react";

export default function ReportChart(props: {
  data: HistogramData[];
  xAxisLabel: string;
  yAxisLabel: string;
  tooltip: ReactElement;
}) {
  return (
    <div className="histogram">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={props.data}
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
              value: props.xAxisLabel,
              position: "insideBottom",
              dy: 20,
            }}
            dataKey="bucketName"
          />
          <YAxis
            label={{
              value: props.yAxisLabel,
              dx: -5,
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip content={props.tooltip} />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="score" fill="#0055a2" label="Test" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
