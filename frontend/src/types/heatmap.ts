export interface RestHeatmapNonLeafNode {
  name: string;
  children: RestHeatmapNode[];
}

export interface RestHeatmapLeafNode {
  name: string;
  value: number;
}

export type RestHeatmapNode = RestHeatmapNonLeafNode | RestHeatmapLeafNode;

export interface RestHeatmap {
  root: RestHeatmapNode;
}
