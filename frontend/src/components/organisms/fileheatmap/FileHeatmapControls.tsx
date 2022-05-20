import {FC, useMemo} from "react";
import {GitSnapshotHeatmapMode} from "../../../backend/remote/requests/getGitCommitHeatmap";
import {DebtType} from "../../../types/debt";
import {ButtonList} from "../../atoms/buttonlist/ButtonList";
import {ButtonListItem} from "../../atoms/buttonlist/ButtonListItem";
import {Panel} from "../../atoms/panel/Panel";

interface FileHeatmapControlsProps {
  mode: [GitSnapshotHeatmapMode, DebtType | null];

  onChange(mode: [GitSnapshotHeatmapMode, DebtType | null]): void;
}

const modes: {label: string; value: [GitSnapshotHeatmapMode, DebtType | null]}[] = [
  {label: "All comments", value: [GitSnapshotHeatmapMode.ALL_COMMENTS, null]},
  {label: "All debt", value: [GitSnapshotHeatmapMode.ALL_DEBT, null]},
  {label: "Code design debt", value: [GitSnapshotHeatmapMode.DEBT_TYPE, DebtType.CODE_DESIGN]},
  {label: "Documentation debt", value: [GitSnapshotHeatmapMode.DEBT_TYPE, DebtType.DOCUMENTATION]},
  {label: "Requirement debt", value: [GitSnapshotHeatmapMode.DEBT_TYPE, DebtType.REQUIREMENT]},
  {label: "Test debt", value: [GitSnapshotHeatmapMode.DEBT_TYPE, DebtType.TEST]}
];

export const FileHeatmapControls: FC<FileHeatmapControlsProps> = ({mode, onChange}) => {
  const activeIndex = useMemo(
    () => modes.findIndex(({value: [heatmapMode, debtType]}) => mode[0] === heatmapMode && mode[1] === debtType),
    [mode]
  );

  return (
    <Panel>
      <ButtonList>
        {modes.map(({label, value}, index) => (
          <ButtonListItem key={index} onClick={() => onChange(value)} active={activeIndex === index}>
            {label}
          </ButtonListItem>
        ))}
      </ButtonList>
    </Panel>
  );
};
