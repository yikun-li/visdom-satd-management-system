import {formatISO9075} from "date-fns";
import {FC, useMemo} from "react";
import {CartesianGrid, Legend, Line, LineChart as Chart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface LineChartProps {
  data: {value: number; date: number}[];
}

/**
 * Decides if the data is
 */
function isTimeSignificant(data: {value: number; date: number}[]): boolean {
  const interval = data.length > 0 ? data[data.length - 1].date - data[0].date : 0;
  return interval < 5 * 24 * 60 * 60 * 1000;
}

export const LineChart: FC<LineChartProps> = ({data}) => {
  const timeSignificance = useMemo(() => isTimeSignificant(data), [data]);

  return (
    <ResponsiveContainer minHeight={240}>
      <Chart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            formatISO9075(new Date(value), {representation: timeSignificance ? "time" : "date"})
          }
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </Chart>
    </ResponsiveContainer>
  );
};
