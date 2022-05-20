import {FC} from "react";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {DebtType} from "../../../types/debt";
import {GraphTooltip} from "../tooltip/GraphTooltip";

interface DebtTypePieGraphProps {
  data: Record<string, any>[];
  dataKey: string;
  nameKey: string;

  formatName(name: string): string;
}

const colors = ["#35BD3D", "#2835FF", "#F9BF21", "#F65354"];

export const DebtTypePieGraph: FC<DebtTypePieGraphProps> = ({data, dataKey, nameKey, formatName}) => {
  return (
    <ResponsiveContainer minHeight={240}>
      <PieChart>
        <Pie dataKey={dataKey} nameKey={nameKey} data={data}>
          {data.map(({type}, i) => (
            <Cell key={type} fill={colors[i % colors.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={(props) => <GraphTooltip {...props} formatName={formatName} />} />
      </PieChart>
    </ResponsiveContainer>
  );
};
