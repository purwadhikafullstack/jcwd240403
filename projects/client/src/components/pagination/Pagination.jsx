import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate"
import { TbArrowLeft, TbArrowRight } from "react-icons/tb"
import Row from "../widget/Row";

export default function Pagination({ initialPage = 0, totalPage = 1, onChangePage }) {
  const [currentPage, setCurrentPage] = useState(initialPage ?? 0)
  const onChange = (page) => {
    const { selected } = page
    onChangePage(selected + 1)
  }
  // useEffect(() => {

  // }, [])

  return (
    <>

      <ReactPaginate forcePage={currentPage} pageCount={Math.ceil(totalPage)}
        className="flex flex-row max-w-full overflow-x-auto gap-2 border-t justify-between border-r-tran "
        activeClassName="text-blue-600 font-medium border-t border-t-blue-600 p-2 "
        pageClassName="text-gray-500 hover:text-blue-600 p-2"
        previousLabel={<Row className="gap-3" ><TbArrowLeft className="h-5 w-5 my-auto" />Previous</Row>}
        nextLabel={<Row className="gap-3">Next<TbArrowRight className="h-5 w-5 my-auto" /></Row>}
        previousLinkClassName="text-gray-500 hover:text-blue-600 hover:bg-blue-100 "
        nextLinkClassName="text-gray-500 hover:text-blue-600 hover:bg-blue-100"
        previousClassName="p-2 border-t border-t-transparent hover:border-t-blue-600"
        nextClassName="p-2 border-t border-t-transparent hover:border-t-blue-600"
        onPageChange={onChange} />




    </>
    // <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
    //   <div className="-mt-px flex w-0 flex-1">
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    //     >
    //       <ArrowLongLeftIcon
    //         className="mr-3 h-5 w-5 text-gray-400"
    //         aria-hidden="true"
    //       />
    //       Previous
    //     </a>
    //   </div>
    //   <div className="hidden md:-mt-px md:flex">
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    //     >
    //       1
    //     </a>
    //     {/* Current: "border-sky-500 text-sky-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-sky-500 px-4 pt-4 text-sm font-medium text-sky-600"
    //       aria-current="page"
    //     >
    //       2
    //     </a>
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    //     >
    //       3
    //     </a>
    //     <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
    //       ...
    //     </span>
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    //     >
    //       8
    //     </a>
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    //     >
    //       9
    //     </a>
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    //     >
    //       10
    //     </a>
    //   </div>
    //   <div className="-mt-px flex w-0 flex-1 justify-end">
    //     <a
    //       href="#"
    //       className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    //     >
    //       Next
    //       <ArrowLongRightIcon
    //         className="ml-3 h-5 w-5 text-gray-400"
    //         aria-hidden="true"
    //       />
    //     </a>
    //   </div>
    // </nav>
  );
}
