import {FC, useMemo} from "react";
import {Keyword} from "./Keyword";
import s from "./KeywordsList.module.scss";

interface KeywordsListProps {
  keywords: Record<string, number>;
}

export const KeywordsList: FC<KeywordsListProps> = ({keywords}) => {
  const sorted = useMemo(() => Object.entries(keywords).sort(([, a], [, b]) => b - a), [keywords]);

  return (
    <div className={s.container}>
      {sorted.map(([word, value]) => (
        <Keyword key={word} word={word} value={value} />
      ))}
    </div>
  );
};
