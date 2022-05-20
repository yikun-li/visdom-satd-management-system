import {interpolateLab} from "d3";
import dynamic from "next/dynamic";
import {FC} from "react";
import {DataNode} from "sunburst-chart";
import {RestHeatmap} from "../../../types/heatmap";
import {Panel} from "../../atoms/panel/Panel";

const HeatmapGraph = dynamic(async () => (await import("../../atoms/graphs/HeatmapGraph")).HeatmapGraph, {
  ssr: false
});

const i = interpolateLab("#2835FF", "#F65354");

function getTooltipTitle(node: DataNode): string {
  const name = node.data.name || "?";
  return node.parent ? getTooltipTitle(node.parent) + name : name;
}

function getNodeRoot(node: DataNode): DataNode {
  return node.parent ? getNodeRoot(node.parent) : node;
}

function getNodePercentage(node: DataNode): number {
  return node.parent ? node.value / node.parent.value : 1;
}

function getNodeColor(node: DataNode): string {
  return i(getNodePercentage(node));
}

interface FileHeatmapPanelProps {
  loading: boolean;
  heatmap: RestHeatmap | null;
}

export const FileHeatmapPanel: FC<FileHeatmapPanelProps> = ({loading, heatmap}) => {
  return (
    <Panel loading={loading} fullHeight>
      {heatmap && (
        <HeatmapGraph
          data={heatmap}
          onSettings={(instance) =>
            instance
              .tooltipTitle((d, node) => getTooltipTitle(node))
              .tooltipContent((d, node) => `Size: <i>${node.value}/${getNodeRoot(node).value}</i>`)
              .color((node) => getNodeColor(node.__dataNode!))
          }
        />
      )}
    </Panel>
  );
};
