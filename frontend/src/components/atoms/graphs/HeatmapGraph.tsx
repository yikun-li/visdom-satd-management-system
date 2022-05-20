import {FC, useEffect, useRef} from "react";
import SunburstChart, {SunburstChartInstance} from "sunburst-chart";
import {RestHeatmap, RestHeatmapNonLeafNode} from "../../../types/heatmap";
import {ClassNameProp} from "../../../types/props";
import s from "./HeatmapGraph.module.scss";
import c from "classnames";

interface HeatmapGraphProps extends ClassNameProp {
  data: RestHeatmap;

  onSettings(instance: SunburstChartInstance): SunburstChartInstance;
}

export const HeatmapGraph: FC<HeatmapGraphProps> = ({data, className, onSettings}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef(onSettings);

  useEffect(() => {
    settingsRef.current = onSettings;
  }, [onSettings]);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
      settingsRef
        .current(SunburstChart())
        .width(container.current.clientWidth)
        .height(container.current.clientHeight)
        .label("name")
        .size("value")
        .strokeColor("#171717")
        .data(data.root as RestHeatmapNonLeafNode)(container.current);
    }
  }, [data, onSettings]);

  return <div ref={container} className={c(className, s.graph)} />;
};
