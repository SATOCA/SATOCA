import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./DisplayReport.css";
import { Report } from "../../../../../DataModel/dto/CreateReportResponseDto";

export default function DisplayReport(props: {
  report: Report;
  back: () => void;
}) {
  return (
    <div className="histogram">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={props.report.histogramData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bucketName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="participantNumber" fill="#ffc658" label="Test" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
