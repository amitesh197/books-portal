import React, { useContext, useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EditRowDataModal from "./EditRowDataModal";
import { useGlobalContext } from "../context/globalContext";
import PrevVersionsModal from "./PrevVersionsModal";

export default function DataTable({
  groupedUserData,
  ungroupedUserData,
  handleEditRowData,
  editingRowData,
  isModalOpen,
  setIsModalOpen,
}) {
  // console.log("ungroupedUserData", ungroupedUserData);
  // console.log("groupedUserData", groupedUserData);
  /*groupedUserData= 
        {
        "1692943564405": [
            {
              dataId,
              currentDay,
              currentMonth,
              currentYear,
              type,
              count,
              comment,
              edited
            },
            ...
        ],
        "1692943564300": [
            {
              dataId,
              currentDay,
              currentMonth,
              currentYear,
              type,
              count,
              comment,
              edited
            },...
        ],
        ...
    } 
    
    ungroupedUserData=
    [
    {
        dataId,
        currentDay,
        currentMonth,
        currentYear,
        type,
        count,
        comment,
        edited
    },
   ...
]

    */
  const { userInfo } = useGlobalContext();
  const [columns, setColumns] = useState([]); // [ {id: 1, header: "Date", accessorKey: "Date", footer: "Date"}, ...
  const [columnSizing, setColumnSizing] = useState({});
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [rowData, setRowData] = useState(null); // { "Date": 13, "Month": 8, "Year": 2023, "Type": "live", "ClassName": "asdf", "Hours": 5, "Minutes": 20 }
  const [prevVerModalOpen, setPrevVerModalOpen] = useState(false);
  const [prevVerionsArray, setPrevVerionsArray] = useState([]);

  const table = useReactTable({
    data: ungroupedUserData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    state: {
      sorting: sorting,
      globalFilter: filtering,
      columnSizing,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnSizingChange: setColumnSizing,
  });

  const handleEditClick = (row) => {
    // console.log("row", row);
    setRowData(row);
    setIsModalOpen(true);
  };

  const handleShowPrevVer = (row) => {
    // console.log("row", row);
    setPrevVerionsArray(groupedUserData[row.Id]);
    setPrevVerModalOpen(true);
  };

  useEffect(() => {
    let id = 1;
    // Exclude the "Id" column  if user is admin
    if (userInfo?.isAdmin === true) {
      const uniqueColumns = Array.from(
        new Set(ungroupedUserData?.flatMap((response) => Object.keys(response)))
      )
        .filter((key) => key !== "Id")
        .map((key) => ({
          id: id++,
          header: key,
          accessorKey: key,
          footer: key,
        }));

      setColumns(uniqueColumns);
    } else {
      // Exclude the "Id" column and "Edited " column is user is not admin

      const uniqueColumns = Array.from(
        new Set(ungroupedUserData?.flatMap((response) => Object.keys(response)))
      )
        .filter((key) => key !== "Id" && key !== "Edited")
        .map((key) => ({
          id: id++,
          header: key,
          accessorKey: key,
          footer: key,
        }));

      setColumns(uniqueColumns);
    }

    // console.log("uniqueColumns", uniqueColumns);
  }, [ungroupedUserData]);

  return (
    <>
      {isModalOpen && rowData && (
        <EditRowDataModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          rowData={rowData}
          handleEditRowData={handleEditRowData}
          editingRowData={editingRowData}
        >
          this is the modal
        </EditRowDataModal>
      )}

      {prevVerModalOpen && (
        <PrevVersionsModal
          prevVerionsArray={prevVerionsArray}
          prevVerModalOpen={prevVerModalOpen}
          setPrevVerModalOpen={setPrevVerModalOpen}
        />
      )}

      <div className="p-4">
        {/* Pagination and search bar container */}
        <div className="flex items-center justify-between mb-4">
          {/* Pagination and search bar */}
          <div className="flex space-x-2 items-center">
            {/* Pagination buttons */}
            <button
              className={`mx-1 ${
                !table.getCanPreviousPage() && "text-gray-300"
              }`}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
            >
              <i className="fa-solid fa-angles-left"></i>
            </button>
            <button
              className={`mx-1 ${
                !table.getCanPreviousPage() && "text-gray-300"
              }`}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <strong className="mx-2 text-sm">
              {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.ceil(
                ungroupedUserData.length / table.getState().pagination.pageSize
              )}
            </strong>
            <span className="w-fit">
              <p className="inline text-sm">
                <span className="border-r-2 border-gray-500 mx-2"></span>Go to
                page
              </p>
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border border-theme-yellow-dark rounded-md w-12 text-center py-1 mx-2 text-sm"
              />
            </span>
            <select
              className="select-page-rows border border-theme-yellow-dark rounded-md px-2 py-1 text-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <button
              className={`mx-1 ${!table.getCanNextPage() && "text-gray-300"}`}
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button
              className={`mx-1 ${!table.getCanNextPage() && "text-gray-300"}`}
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              <i className="fa-solid fa-angles-right"></i>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {" "}
            {/* Search bar */}
            <div className=" p-1 text-theme-dark">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input
              className="border rounded-md px-2 py-1 w-40 outline-none border-theme-dark focus:border-theme-yellow-dark"
              type="search"
              placeholder="Search in table..."
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
            />
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          {/* Add horizontal scroll if needed */}
          <table className="table-auto border-collapse border w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      colSpan={header.colSpan}
                      className="border border-gray-500 px-3 py-2 text-left bg-theme-yellow-dark relative w-fit "
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            <span className="float-right">
                              {header.column.getIsSorted() === "asc" ? (
                                <i className="fa-solid fa-arrow-down-a-z"></i>
                              ) : (
                                <i className="fa-solid fa-arrow-down-z-a"></i>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row
                    .getVisibleCells()
                    .filter((cell) => cell.column.accessorKey !== "Id") // Exclude "Id" column cells
                    .map((cell) => (
                      <td
                        id={cell.id}
                        key={cell.id}
                        className="border border-gray-500 px-3 py-2 bg-theme-gray w-fit"
                      >
                        <div>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    ))}

                  {userInfo?.isAdmin === true ? (
                    // Show previous version icon cell
                    <td className="border border-gray-500 px-3 py-2 bg-theme-gray w-fit">
                      <div
                        className="cursor-pointer text-center text-theme-dark hover:text-theme-yellow-dark"
                        onClick={() => handleShowPrevVer(row.original)}
                      >
                        <i className="fa-solid fa-clock-rotate-left"></i>
                      </div>
                    </td>
                  ) : (
                    // Edit icon cell
                    <td className="border border-gray-500 px-3 py-2 bg-theme-gray w-fit">
                      <div
                        className="cursor-pointer text-center text-theme-dark hover:text-theme-yellow-dark"
                        onClick={() => handleEditClick(row.original)}
                      >
                        <i className="fa-regular fa-pen-to-square "></i>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
