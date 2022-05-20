import Head from "next/head";
import {FC} from "react";
import {Page} from "../components/atoms/layout/Page";

interface ErrorTemplateProps {
  title: string;
}

export const ErrorTemplate: FC<ErrorTemplateProps> = ({title}) => {
  return (
    <Page>
      <Head>
        <title>Error: {title}</title>
      </Head>
    </Page>
  );
};
