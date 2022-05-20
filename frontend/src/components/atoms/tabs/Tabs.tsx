import {Context, createContext, FC} from "react";
import s from "./Tabs.module.scss";

interface TabsContextValue {
  current: string;
  onChange(id: string): void;
}

export const TabsContext: Context<TabsContextValue> = createContext({} as TabsContextValue);

interface TabsProps {
  current: string;
  onChange(id: string): void;
}

export const Tabs: FC<TabsProps> = ({children, current, onChange}) => {
  const contextValue: TabsContextValue = {
    current,
    onChange
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <ul className={s.list}>{children}</ul>
    </TabsContext.Provider>
  );
};
