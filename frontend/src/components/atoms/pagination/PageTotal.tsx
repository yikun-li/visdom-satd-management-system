import {FC} from "react";
import {Paragraph} from "../typography/Paragraph";

interface PageTotalProps {
  size: number;
  total: number;
}

export const PageTotal: FC<PageTotalProps> = ({size, total}) => {
  return (
    <Paragraph>
      Showing {size} out of {total} items
    </Paragraph>
  );
};
