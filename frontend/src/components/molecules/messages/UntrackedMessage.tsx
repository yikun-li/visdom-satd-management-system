import {FC} from "react";
import {Button} from "../../atoms/buttons/Button";
import {Stack} from "../../atoms/layout/Stack";
import {Panel} from "../../atoms/panel/Panel";
import {Code} from "../../atoms/typography/Code";
import {Heading} from "../../atoms/typography/Heading";
import {Paragraph} from "../../atoms/typography/Paragraph";

interface UntrackedMessageProps {
  branch: string;
  loading?: boolean;

  onClickTrack?(): void;
}

export const UntrackedMessage: FC<UntrackedMessageProps> = ({branch, loading, onClickTrack}) => {
  return (
    <Panel fill="red" loading={loading}>
      <Stack spacing="m">
        <Heading>Statistics unavailable</Heading>
        <Paragraph>
          The statistics for the branch <Code>{branch}</Code> are not available. Please track the branch first.
        </Paragraph>
        {onClickTrack && (
          <Button type="light" onClick={onClickTrack}>
            Start tracking
          </Button>
        )}
      </Stack>
    </Panel>
  );
};
