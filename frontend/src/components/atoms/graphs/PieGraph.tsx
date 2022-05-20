import {ApexOptions} from "apexcharts";
import dynamic from "next/dynamic";
import {FC} from "react";

const Chart = dynamic(async () => (await import("react-apexcharts")).default, {ssr: false});

const CHART_OPTIONS: ApexOptions = {
  stroke: {
    width: 0
  },
  dataLabels: {enabled: true},
  legend: {position: "bottom", horizontalAlign: "left"},
  theme: {},
  plotOptions: {
    pie: {
      offsetY: 80,
      expandOnClick: false,
      donut: {
        size: 360 as any
      }
    }
  }
};

interface PieGraphProps {
  data: number[];
  labels: string[];
}

export const PieGraph: FC<PieGraphProps> = ({data, labels}) => {
  return <Chart type="donut" series={data} options={{...CHART_OPTIONS, labels}} />;
};
