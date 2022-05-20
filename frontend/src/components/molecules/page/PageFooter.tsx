import {FC} from "react";
import {RestPage} from "../../../types/paging";
import {PageTotal} from "../../atoms/pagination/PageTotal";
import {Pagination} from "../../atoms/pagination/Pagination";
import s from "./PageFooter.module.scss";

interface PageFooterProps {
  page: RestPage<unknown>;

  onChangePage(page: number): void;
}

export const PageFooter: FC<PageFooterProps> = ({page, onChangePage}) => {
  return (
    <div className={s.container}>
      <PageTotal size={page.size} total={page.totalElements} />
      <Pagination page={page} onChangePage={onChangePage} />
    </div>
  );
};
