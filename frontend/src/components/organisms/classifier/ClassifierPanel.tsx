import {FC} from "react";
import {AnalyserRunningState} from "../../../types/analyser";
import {AnalyserRunningStateDescr} from "../../../util/descriptions";
import {Button} from "../../atoms/buttons/Button";
import {Stack} from "../../atoms/layout/Stack";
import {Panel} from "../../atoms/panel/Panel";
import {Label} from "../../atoms/typography/Label";
import {Paragraph} from "../../atoms/typography/Paragraph";

interface ClassifierPanelProps {
  title: string;
  status: AnalyserRunningState;
  workLeft: number;
  loading?: boolean;

  onStart(): void;
}

export const ClassifierPanel: FC<ClassifierPanelProps> = ({title, onStart, status, loading, workLeft}) => {
  return (
    <Panel title={title} loading={loading}>
      <Stack spacing="l">
        <Paragraph>
          Status:{" "}
          <Label color={status === AnalyserRunningState.IDLING ? "yellow" : "green"}>
            {AnalyserRunningStateDescr[status].name}
          </Label>
        </Paragraph>
        <Paragraph>Work left: {workLeft} items</Paragraph>

        <Stack spacing="m" horizontal end>
          <Button type="color" tint="blue" onClick={onStart}>
            Start
          </Button>
        </Stack>
      </Stack>
    </Panel>
  );
};
