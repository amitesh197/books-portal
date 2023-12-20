import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Toaster, toast } from "react-hot-toast";

import React, { useEffect, useState } from "react";
import CommentModal from "./CommentModal";

export default function TableRenderer({ data, columns, getData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [columnSizing, setColumnSizing] = useState({});
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [selectedCellValue, setSelectedCellValue] = useState({});

  const columnMapping = {
    id: "ID",
    date: "Date",
    name: "Name",
    new_name: "New Name",
    email: "Email",
    new_email: "New Email",
    number: "Number",
    new_number: "New Number",
    current_batch: "Current Batch",
    new_batch: "New Batch",
    current_course: "Current Course",
    new_course: "New Course",
    content_desc: "Content Description",
    reason: "Reason",
    feedback: "Feedback",
    first_installment: "First Installment",
    second_installment: "Second Installment",
    file_link: "File Link",
    query_desc: "Query Description",
    taken_by: "Taken By",
    comment: "Comment",
    status: "Status",
  };

  const handleCellClick = (cell) => {
    const cellValue = cell.getValue(cell.column.id);
    setSelectedCellValue({
      value: cellValue,
    });
    // console.log({
    //   value: cellValue,
    //   x: eleCoordinates.x,
    //   y: eleCoordinates.y,
    // });
    // Check if the clicked cell is in the "comment" column
    if (cell.column.id === "comment") {
      const rowId = cell.row.original.id;
      const comment = cell.row.original.comment;
      // console.log("Clicked on comment cell in row with ID:", rowId);
      setSelectedRowId(rowId);
      setSelectedComment(comment);
      setIsModalOpen(true);
    }
  };

  const handleSaveComment = async (comment) => {
    toast.loading("Adding comment", selectedRowId);
    try {
      // Send a delete query to Supabase
      console.log({ id: selectedRowId, comment: comment });
      const response = await fetch(
        "https://g87ruzy4zl.execute-api.ap-south-1.amazonaws.com/dev/queries/",
        {
          method: "PUT",
          body: JSON.stringify({ id: selectedRowId, comment: comment }),
          // or 'POST' or other HTTP methods
        }
      );
      if (!response.ok) {
        throw new Error(`${response.type} error! Status: ${response.status}`);
      }
      getData({ withToast: false });
      toast.dismiss();
      toast.success("Comment added!");
    } catch (error) {
      //clear toast
      toast.dismiss();
      toast.error(error.message);
      console.error("error:", error);
    }
  };

  const table = useReactTable({
    data,
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
  useEffect(() => {
    // console.log("data", data);
    /*  
    data = [
    {
        "id": 1,
        "how are you ??": "hello "
    },
    {
        "id": 2,
        "how are you ??": "good"
    },...
]
    */
    // console.log("columns", columns);
    /*
    columns = [
    {
        "id": "date",
        "header": "date",
        "accessorKey": "date",
        "footer": "date"
    },
   {
    "id": "new_name",
    "header": "new_name",
    "accessorKey": "new_name",
    "footer": "new_name"
}
    ...
]
    */
  }, [data, columns]);
  var isDone = false;

  return (
    <div className="table-elements-container">
      {isModalOpen && (
        <CommentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveComment}
          currComment={selectedComment}
        />
      )}
      <div className="pagination-and-searchbar-container">
        <div className="pagination-buttons-container">
          <button
            className={`pagination-button ${
              !table.getCanPreviousPage() && "disabled"
            }`}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
          >
            <i className="fa-solid fa-angles-left"></i>
          </button>
          <button
            className={`pagination-button ${
              !table.getCanPreviousPage() && "disabled"
            }`}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>

          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.ceil(data.length / table.getState().pagination.pageSize)}
          </strong>

          <span className="go-to-input">
            <p>
              <span></span>Go to page
            </p>
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </span>
          <select
            className="select-page-rows"
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
            className={`pagination-button ${
              !table.getCanNextPage() && "disabled"
            }`}
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.nextPage();
            }}
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <button
            className={`pagination-button ${
              !table.getCanNextPage() && "disabled"
            }`}
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            <i className="fa-solid fa-angles-right"></i>
          </button>
        </div>
        <div className="table-search-bar">
          <div className="icon"></div>
          <input
            className="input"
            type="search"
            placeholder="Search in table..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table
          className="table relative"
          cellSpacing={0}
          style={{
            width: `${
              table.getTotalSize() + (table.getAllLeafColumns().length + 1) * 3 // I got better result when I added this which is related with the tr css borders !
            }px`,
          }}
        >
          <thead className=" table-head">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="table-head-row" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="table-head-cell"
                    key={header.id}
                    data-column-name={header.id} // useEffect depends on that !
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.column.getCanResize() ? (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={` resize-div ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      />
                    ) : null}
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          columnMapping[header.id] ||
                            header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="table-body ">
            {table.getRowModel().rows.map((row) => (
              <tr className={`table-body-row`} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const isDone =
                    cell.column.id === "status" && cell.getValue() === "done";

                  return (
                    <td
                      id={cell.id}
                      className={`table-body-cell ${isDone ? "done-cell" : ""}`}
                      key={cell.id}
                      onClick={() => handleCellClick(cell)}
                      style={{ width: cell.column.getSize() }}
                    >
                      <div>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCellValue && (
        <div className="selected-cell-popup">{selectedCellValue.value}</div>
      )}
    </div>
  );
}
