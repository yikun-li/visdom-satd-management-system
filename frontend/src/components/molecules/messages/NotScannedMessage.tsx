import {FC} from "react";
import {Stack} from "../../atoms/layout/Stack";
import {Panel} from "../../atoms/panel/Panel";
import {Heading} from "../../atoms/typography/Heading";
import {Paragraph} from "../../atoms/typography/Paragraph";

interface NotScannedMessageProps {}

export const NotScannedMessage: FC<NotScannedMessageProps> = () => {
  return (
    <Panel>
      <Stack spacing="l">
        <Heading>Not scanned</Heading>
        <Paragraph>The file browser is unavailable as this commit has not been scanned yet.</Paragraph>
      </Stack>
    </Panel>
  );
};
