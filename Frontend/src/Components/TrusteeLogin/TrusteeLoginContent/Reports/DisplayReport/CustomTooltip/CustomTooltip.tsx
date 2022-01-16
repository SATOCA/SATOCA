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
    return round(input, precision);
  };

  // see https://stackoverflow.com/a/7343013
  const round = (value: number, precision: number = 0): string => {
    const multiplier = Math.pow(10, precision);
    const result = Math.round(value * multiplier) / multiplier;

    return result.toFixed(precision);
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
