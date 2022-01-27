import { TooltipProps } from "recharts";

type ValueType = number | string | Array<number | string>;
type NameType = number | string;

export default function BehaviorTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  const parsePercentage = (input: any, precision: number): string => {
    if (input === undefined) return "---";
    return input.toFixed(precision);
  };

  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-share">
          {`Median time per question: ${parsePercentage(payload?.[0].value, 2)} s`}
        </p>
      </div>
    );
  }

  return null;
}
