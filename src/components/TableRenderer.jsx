import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Toaster, toast } from "react-hot-toast";
import { useGlobalContext } from "../context/globalContext";

import React, { useEffect, useState } from "react";
import CommentModal from "./CommentModal";
import ChangeStatusModal from "./ChangeStatusModal";

// eslint-disable-next-line react/prop-types
export default function TableRenderer({ data, columns,updateRow }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [columnSizing, setColumnSizing] = useState({});
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [selectedCellValue, setSelectedCellValue] = useState({});
  const [changeStatusModal, setChangeStatusModal] = useState(false);
  const { userInfo } = useGlobalContext();
  // console.log("data", data);

  const columnMapping = {
    id: "ID",
    date: "Date",
    name: "Name",
    new_name: "New Name",
    email: "Email",
    new_email: "New Email",
    number: "Number",
    new_number: "New Number",
    amount: "Amount",
    current_batch: "Current Batch",
    new_batch: "New Batch",
    current_course: "Current Course",
    new_course: "New Course",
    content_desc: "Content Description",
    reason: "Reason",
    feedback: "Feedback",
    first_installment: "First Installment",
    second_installment: "Second Installment",
    file: "File",
    deviceName: "Device Name",
    deviceSpecs: "Device Specs",
    query_desc: "Query Description",
    taken_by: "Taken By",
    comment: "Comment",
    status: "Status",
    "oc_answered": "OC Answered",
    "oc_missed": "OC Missed",
    "ic_missed": "IC Missed",
    "ic_answered": "IC Answered",
    "agent_name": "Agent Name",
    "total_calls": "Total Calls",
    "duration": "Duration in secs"

  };

  const handleCellClick = (cell) => {
    {
      if (userInfo.isAdmin) {
        if (cell.column.id === "comment") {
          // console.log("Clicked on comment cell in row with ID:", rowId);
          setSelectedRowId(cell.row.original.id);
          setSelectedComment(cell.row.original.comment);
          setIsModalOpen(true);
        } else if (cell.column.id === "status") {
          // console.log("Clicked on comment cell in row with ID:", rowId);
          setSelectedRowId(cell.row.original.id);
          setCurrentStatus(cell.row.original.status);
          setChangeStatusModal(true);
        }
      } else {
        console.log("Not an Admin :(");
      }
    }
  };

  const handleSaveComment = async (comment) => {
    toast.loading("Adding comment", selectedRowId);
    try {
      // Send a add comment query to dynamodb
      // console.log({ id: selectedRowId, comment: comment });
      const response = await fetch(
        "https://446kx5s4a4.execute-api.ap-south-1.amazonaws.com/dev/queries/",
        {
          method: "PUT",
          body: JSON.stringify({
            id: selectedRowId,
            comment: comment,
            toUpdate: "comment",
          }),
          // or 'POST' or other HTTP methods
        }
      );
      if (!response.ok) {
        throw new Error(`${response.type} error! Status: ${response.status}`);
      }
      // getData({ withToast: false });
      // Update the front end directly
      updateRow(selectedRowId, { comment: comment });

      toast.dismiss();
      toast.success("Comment added!");
    } catch (error) {
      //clear toast
      toast.dismiss();
      toast.error(error.message);
      console.error("error:", error);
    }
  };

  const handleChangeStatus = async (status) => {
    toast.loading("changing status", selectedRowId);
    try {
      // Send a delete query to dynamodb
      // console.log({ id: selectedRowId, status: status });
      const response = await fetch(
        "https://446kx5s4a4.execute-api.ap-south-1.amazonaws.com/dev/queries/",
        {
          method: "PUT",
          body: JSON.stringify({
            id: selectedRowId,
            status_: status,
            toUpdate: "status",
          }),
          // or 'POST' or other HTTP methods
        }
      );
      let data = await response.json();
      // console.log("data", data);
      if (!response.ok) {
        throw new Error(`${response.type} error status: ${response.status}`);
      }
      // Update the front end directly
      updateRow(selectedRowId, { status: status });
      toast.dismiss();
      toast.success("Status updated!");
      // getData({ withToast: false });
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
      globalFilter: filtering,
      columnSizing,

      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnSizingChange: setColumnSizing,
    initialState: {
      sorting: [
        {
          id: 'date',
          desc: true, // sort by date in descending order by default
        },
      ],
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
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
      {changeStatusModal && (
        <ChangeStatusModal
          onClose={() => setChangeStatusModal(false)}
          handleChangeStatus={handleChangeStatus}
          currentStatus={currentStatus}
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
                        data-column-name={header.id}
                        colSpan={header.colSpan}
                        style={{width: header.getSize()}}
                    >
                      {header.column.getCanResize() ? (
                          <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={`resize-div ${
                                  header.column.getIsResizing() ? "isResizing" : ""
                              }`}
                          />
                      ) : null}
                      {header.isPlaceholder ? null : (
                          <div
                              className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                              onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                                columnMapping[header.id] || header.column.columnDef.header,
                                header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                      )}
                    </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="table-body">
          {table.getRowModel().rows.map((row) => (
              <tr className={`table-body-row`} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const isDone =
                      cell.column.id === "status" && cell.getValue() === "Done";

                  return (
                      <td
                          id={cell.id}
                          className={`table-body-cell ${isDone ? "done-cell" : ""}`}
                          key={cell.id}
                          onClick={() => handleCellClick(cell)}
                          style={{width: cell.column.getSize()}}
                      >
                        <div>
                          {cell.column.id === "file" ? (
                              row.original.file ? ( // If the column is "file", render a link
                            <a
                              href={row.original.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#007bff",
                                textDecoration: "underline",
                              }}
                            >
                              View file
                            </a>
                          ) : (
                            <p>No file</p>
                          )
                        ) : (
                          // Render other cells as usual
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
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
    </div>
  );
}
