import {IconFC} from "*.svg";
import {FC, PropsWithChildren, useContext, useMemo} from "react";
import {ButtonListItem} from "../../atoms/buttonlist/ButtonListItem";
import {NavBarContext} from "./NavBar";

interface NavBarItemProps<T> {
  id?: T;
  to?: string;
  icon?: IconFC;
}

export function NavBarItem<T = string>({
  id,
  to,
  icon,
  children
}: PropsWithChildren<NavBarItemProps<T>>): ReturnType<FC<NavBarItemProps<T>>> {
  const {active, getUrl} = useContext(NavBarContext as NavBarContext<T>);
  const url = useMemo(() => (id ? getUrl(id) : to ? {href: to, as: to} : {href: "/", as: "/"}), [getUrl, id, to]);

  return (
    <ButtonListItem icon={icon} url={url} active={active === id}>
      {children}
    </ButtonListItem>
  );
}
