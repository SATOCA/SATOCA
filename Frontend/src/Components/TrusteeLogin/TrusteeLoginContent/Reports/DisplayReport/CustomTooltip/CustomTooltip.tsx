import { TooltipProps } from "recharts";

type ValueType = number | string | Array<number | string>;
type NameType = number | string;

export const CustomTooltip = ({
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
