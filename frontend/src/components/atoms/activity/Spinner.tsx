import dynamic from "next/dynamic";
import {FC} from "react";
import "react-activity/dist/Spinner.css";

const ReactSpinner = dynamic(async () => (await import("react-activity")).Spinner, {ssr: false});

interface SpinnerProps {}

export const Spinner: FC<SpinnerProps> = () => {
  return <ReactSpinner color="#ffffff" />;
};
