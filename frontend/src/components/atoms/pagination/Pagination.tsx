import {FC} from "react";
import ReactPaginate from "react-paginate";
import {ReactComponent as ChevronLeftIcon} from "../../../assets/icons/fa/chevron-left-solid.svg";
import {ReactComponent as ChevronRightIcon} from "../../../assets/icons/fa/chevron-right-solid.svg";
import {RestPage} from "../../../types/paging";
import s from "./Pagination.module.scss";

interface PaginationProps {
  page: RestPage<unknown>;
  onChangePage(page: number): void;
}

export const Pagination: FC<PaginationProps> = ({page, onChangePage}) => {
  return (
    <ReactPaginate
      pageCount={page.totalPages}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      forcePage={page.number}
      onPageChange={({selected}) => onChangePage(selected)}
      disableInitialCallback
      activeClassName={s.active}
      activeLinkClassName={s.activeLink}
      breakClassName={s.break}
      breakLinkClassName={s.breakLink}
      pageClassName={s.page}
      pageLinkClassName={s.pageLink}
      previousClassName={s.button}
      nextClassName={s.button}
      disabledClassName={s.disabled}
      containerClassName={s.container}
      nextLabel={<ChevronRightIcon className={s.icon} />}
      previousLabel={<ChevronLeftIcon className={s.icon} />}
    />
  );
};
