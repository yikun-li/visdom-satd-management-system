import {FC} from "react";
import {ErrorTemplate} from "../../ErrorTemplate";

interface GitRepositoryErrorTemplateProps {
  error: Error;
}

export const GitRepositoryErrorTemplate: FC<GitRepositoryErrorTemplateProps> = ({error}) => {
  return <ErrorTemplate title={error.message} />;
};
