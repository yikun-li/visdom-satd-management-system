import {FC} from "react";
import s from "./KeywordsList.module.scss";
import {interpolateLab} from "d3";

interface KeywordProps {
  word: string;
  value: number;
}

const i = interpolateLab("#2835FF", "#F65354");

export const Keyword: FC<KeywordProps> = ({word, value}) => {
  return (
    <span className={s.keyword} style={{backgroundColor: i(value / 10)}}>
      {word}
    </span>
  );
};
