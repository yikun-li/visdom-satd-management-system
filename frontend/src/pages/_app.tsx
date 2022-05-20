import {AppPropsType} from "next/dist/next-server/lib/utils";
import {FC} from "react";
import {setConfiguration} from "react-grid-system";
import {WebBackendProvider} from "../backend/provider";
import {JobsInformation} from "../components/organisms/jobs/JobsInformation";
import "../styles/globals.scss";

setConfiguration({
  gutterWidth: 24
});

const App: FC<AppPropsType> = ({Component, pageProps}) => {
  return (
    <WebBackendProvider>
      <Component {...pageProps} />
      <JobsInformation />
    </WebBackendProvider>
  );
};

export default App;
