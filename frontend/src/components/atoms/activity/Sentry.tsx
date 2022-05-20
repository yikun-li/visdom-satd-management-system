import dynamic from "next/dynamic";
import {FC} from "react";
import "react-activity/dist/Sentry.css";

const ReactSentry = dynamic(async () => (await import("react-activity")).Sentry, {ssr: false});

interface SentryProps {
  size?: number;
}

export const Sentry: FC<SentryProps> = ({size}) => {
  return <ReactSentry color="#ffffff" size={size} />;
};
