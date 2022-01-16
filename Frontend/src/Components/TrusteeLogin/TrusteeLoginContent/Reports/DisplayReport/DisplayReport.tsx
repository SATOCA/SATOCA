import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import "./DisplayReport.css";
import { Report } from "../../../../../DataModel/dto/CreateReportResponseDto";

type ValueType = number | string | Array<number | string>;
type NameType = number | string;

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-range">{`Range: ${label}`}</p>
        <p className="tooltip-share">{`Share of participants: ${payload?.[0].value}`}</p>
      </div>
    );
  }

  return null;
};

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
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bucketName" />
          <YAxis
            label={{
              value: "   in %    ",
              angle: 0,
              position: "insideLeft",
              textAnchor: "middle",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="participantNumber" fill="#0055a2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
