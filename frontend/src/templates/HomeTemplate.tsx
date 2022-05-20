import Head from "next/head";
import {FC} from "react";
import {Page} from "../components/atoms/layout/Page";

export const HomeTemplate: FC = () => {
  return (
    <Page>
      <Head>
        <title>SATD Analyser</title>
      </Head>
    </Page>
  );
};
