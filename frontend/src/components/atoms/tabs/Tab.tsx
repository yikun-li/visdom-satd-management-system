import c from "classnames";
import {FC, useContext} from "react";
import {TabsContext} from "./Tabs";
import s from "./Tabs.module.scss";

interface TabProps {
  id: string;
}

export const Tab: FC<TabProps> = ({children, id}) => {
  const {current, onChange} = useContext(TabsContext);

  return (
    <li className={c(s.item, current === id && s.active)} onClick={() => onChange(id)}>
      {children}
    </li>
  );
};
