import {FC} from "react";
import {TooltipProps} from "recharts";
import {Tooltip} from "./Tooltip";

interface GraphTooltipProps extends TooltipProps<any, any> {
  formatName?(name: any): string;
  formatValue?(value: any): string;
}

export const GraphTooltip: FC<GraphTooltipProps> = ({active, payload, formatName, formatValue}) => {
  if (!active || !payload || !payload[0].name || !payload[0].dataKey) return null;

  return (
    <Tooltip>
      <strong>{formatName ? formatName(payload[0].name) : payload[0].name}</strong>: {payload[0].value}
    </Tooltip>
  );
};
