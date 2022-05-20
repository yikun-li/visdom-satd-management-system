import Link from "next/link";
import {FC, useContext} from "react";
import {ReactComponent as LeftArrowIcon} from "../../../assets/icons/fa/arrow-left-solid.svg";
import {Button} from "../../atoms/buttons/Button";
import {Heading} from "../../atoms/typography/Heading";
import {NavBarContext} from "../navigation/NavBar";
import s from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  searchValue?: string;

  onSearch?(query: string): void;
}

export const PageHeader: FC<PageHeaderProps> = ({title, onSearch, children}) => {
  const {backUrl} = useContext(NavBarContext);

  return (
    <header className={s.header}>
      {backUrl && (
        <Link href={backUrl} passHref>
          <Button type="icon" tag="a">
            <LeftArrowIcon className={s.backIcon} />
          </Button>
        </Link>
      )}
      <Heading className={s.title}>{title}</Heading>
      {onSearch && <div className={s.search}></div>}
      {children}
    </header>
  );
};
