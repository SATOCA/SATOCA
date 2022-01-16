import { TooltipProps } from "recharts";

type ValueType = number | string | Array<number | string>;
type NameType = number | string;

export default function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  const parsePercentage = (input: any, precision: number) : string => {
    if (input === undefined)
      return "---";
    return input.toFixed(precision);
  };

  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-range">{`Range: ${label}`}</p>
        <p className="tooltip-share">{`Share of participants: ${parsePercentage(payload?.[0].value, 2)}%`}</p>
      </div>
    );
  }

  return null;
}
