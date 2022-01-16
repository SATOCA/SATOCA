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
import CustomTooltip from "./CustomTooltip/CustomTooltip";
import { Report } from "../../../../../DataModel/dto/CreateReportResponseDto";

import "./DisplayReport.css";

export default function DisplayReport(props: { report: Report }) {
  return (
    <div className="histogram">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={props.report.histogramData}
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
          <Bar dataKey="score" fill="#0055a2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
