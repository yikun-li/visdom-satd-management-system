import {FC, useState} from "react";
import {Col, Row} from "react-grid-system";
import {getGitCommitHeatmap, GitSnapshotHeatmapMode} from "../../../backend/remote/requests/getGitCommitHeatmap";
import {useRequestResource} from "../../../hooks/useRequestResource";
import {DebtType} from "../../../types/debt";
import {FileHeatmapControls} from "./FileHeatmapControls";
import {FileHeatmapPanel} from "./FileHeatmapPanel";

interface FileHeatmapBoardProps {
  commitId: number;
}

export const FileHeatmapBoard: FC<FileHeatmapBoardProps> = ({commitId}) => {
  const [mode, setMode] = useState<[GitSnapshotHeatmapMode, DebtType | null]>([GitSnapshotHeatmapMode.ALL_DEBT, null]);
  const heatmap = useRequestResource(getGitCommitHeatmap, [commitId, ...mode]);

  return (
    <Row>
      <Col xl={9} lg={12}>
        <FileHeatmapPanel
          heatmap={!heatmap.loading && heatmap.success ? heatmap.body : null}
          loading={heatmap.loading}
        />
      </Col>
      <Col xl={3} lg={12}>
        <FileHeatmapControls mode={mode} onChange={setMode} />
      </Col>
    </Row>
  );
};
