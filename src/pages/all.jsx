import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import Loading from "../components/Loading";
import Navbar from "../components/navbar";
import TableRenderer from "../components/TableRenderer";

function checkDone(str) {
  var regex = /done/i; // Case-insensitive regex pattern for "done"
  return regex.test(str); // returns boolean
}

const sortData = (data) => {
  var notdoneArr = [];
  var doneArr = [];
  data.forEach((element) => {
    if (!checkDone(element.status)) {
      notdoneArr.push(element);
    } else {
      doneArr.push(element);
    }
  });
  return [...notdoneArr, ...doneArr];
};

function All() {
  const { userInfo, queryType, setQueryType } = useGlobalContext();
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFilteredColumns = (data) => {
    // Columns to always show
    const alwaysShowColumns = [
      "id",
      "date",
      "name",
      "email",
      "number",
      "query_desc",
      "taken_by",
      "comment",
      "status",
    ];
    const columnOrder = [
      "status",
      "id",
      "date",
      "name",
      "new_name",
      "email",
      "new_email",
      "number",
      "new_number",
      "current_batch",
      "new_batch",
      "current_course",
      "new_course",
      "content_desc",
      "reason",
      "feedback",
      "first_installment",
      "second_installment",
      "file_link",
      "query_desc",
      "taken_by",
      "comment",
    ];

    // Get unique columns from the data
    const uniqueColumns = Array.from(
      new Set(data.flatMap((response) => Object.keys(response)))
    ).map((key) => ({
      id: key,
      header: key,
      accessorKey: key,
      footer: key,
    }));

    // Sort columns based on the desired order
    const sortedColumns = uniqueColumns.sort(
      (a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id)
    );

    // Sort data based on the "status" column and id, putting "done" values at the end
    const sortedData = data.sort((a, b) => {
      if (a.status === b.status) {
        return b.id - a.id; // If statuses are the same, sort by id in descending order
      }
      if (a.status === "done" && b.status !== "done") {
        return 1; // "done" values go at the end
      }
      if (a.status !== "done" && b.status === "done") {
        return -1; // "done" values go at the end
      }
      return 0; // All other cases
    });

    // Filter out 'query_type' and "id" columns and sort the rest based on the desired order
    const filteredColumns = sortedColumns
      .filter((column) => column.id !== "query_type" && column.id !== "id")
      .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id));

    // Filter columns based on criteria
    const finalColumns = filteredColumns.filter(
      (column) =>
        alwaysShowColumns.includes(column.id) || // Always show specific columns
        sortedData.some((row) => row[column.id] !== null) // Show if at least one cell is not null
    );

    // Add a "Delete" column at the end
    const deleteColumn = {
      id: "delete",
      header: "Delete",
      accessorKey: "delete",
      footer: "Delete",
      cell: ({ row }) => (
        <td className="delete-cell" key={`delete-${row.id}`}>
          <button onClick={() => handleDelete(row.original.id)}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </td>
      ),
    };

    return [...finalColumns, deleteColumn];
  };

  const handleDelete = async (rowId) => {
    toast.loading("Deleting row", rowId);
    try {
      // Send a delete query to Supabase
      const response = await fetch(
        "https://g87ruzy4zl.execute-api.ap-south-1.amazonaws.com/dev/queries/",
        {
          method: "DELETE",
          body: JSON.stringify({ id: rowId }),
          // or 'POST' or other HTTP methods
        }
      );
      if (!response.ok) {
        throw new Error(`${response.type} error! Status: ${response.status}`);
      }
      getData({ withToast: false });
      toast.dismiss();
      toast.success("Deleted !");
    } catch (error) {
      //clear toast
      toast.dismiss();
      toast.error(error.message);
      console.error("error:", error);
    }
  };

  const getData = async ({ withToast }) => {
    setLoading(true);

    console.log("Fetching data...");
    try {
      // Display a loading message or spinner if needed

      const response = await fetch(
        "https://g87ruzy4zl.execute-api.ap-south-1.amazonaws.com/dev/queries/",
        {
          method: "GET",
          // or 'POST' or other HTTP methods
        }
      );

      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`${response.type} error! Status: ${response.status}`);
      }

      // Parse the response as JSON
      let data = await response.json();
      console.log("All data:", data);

      let sortedData = sortData(data);
      const processedData = sortedData.map((each) => {
        const dateObject = new Date(each.date);
        const day = String(dateObject.getDate()).padStart(2, "0");
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const year = String(dateObject.getFullYear()).slice(2);
        each.date = `${day}/${month}/${year}`;
        return each;
      });

      setColumns(getFilteredColumns(processedData));
      setData(processedData);

      // Display a success message or handle the data as needed
      // console.log("Processed data:", processedData);

      if (withToast) {
        toast.dismiss();
        toast.success();
      }
    } catch (err) {
      // Display an error message or handle the error as needed
      toast.error(err.message);
      console.error("Error:", err);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  useEffect(() => {
    //set the query type to the query in local storage
    const query = localStorage.getItem("queryType");
    //if query is not null then set the query type to the query in local storage
    if (query) {
      setQueryType(query);
    } else {
      setQueryType("nameChange");
      localStorage.setItem("queryType", "nameChange");
    }
    if (userInfo?.email) getData({ withToast: true });
  }, [userInfo?.email, queryType]);

  return (
    <div className="p-2 ">
      <Navbar />
      <div className="flex flex-row gap-3 items-center justify-center  w-fit ">
        <label
          htmlFor="query-type "
          className="w-fit text-left pl-1 text-lg font-semibold "
        >
          Select Query type:
        </label>

        <select
          className="float-left  border-2 border-theme-yellow-dark inline px-3 py-2 rounded-md  text-black outline-none w-fit  cursor-pointer"
          value={queryType}
          onChange={(e) => {
            setQueryType(e.target.value);
            localStorage.setItem("queryType", e.target.value);
          }}
        >
          <option value="nameChange">Name Change</option>
          <option value="batchShift">Batch Shift</option>
          <option value="emi">EMI</option>
          <option value="refund">Refund</option>
          <option value="removeCourseAccess">Remove Course Access</option>
          <option value="feedback">Feedback</option>

          <option value="numberchange">Number change</option>
          <option value="emailchange">Email change</option>
          <option value="contentmissing">Content Missing</option>
          <option value="coursenotvisible">Course Not Visible</option>
          <option value="UPIpayment">UPI Payment</option>
          <option value="grpnotalloted">Group not alloted</option>
          <option value="misc">Misc</option>
        </select>
      </div>
      <Toaster
        position="bottom-left"
        toastOptions={{
          // Define default options
          className: "",

          style: {
            background: "#ff8e00",
            color: "#2e2c2d",
          },

          // Default options for specific types
          success: {
            duration: 2000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />

      {loading && !data ? (
        <Loading />
      ) : data?.length == 0 ? (
        <p className="text-xl  mt-5 text-center w-full">
          No Data of the selected type found.
        </p>
      ) : (
        data &&
        columns && (
          <TableRenderer data={data} columns={columns} getData={getData} />
        )
      )}
    </div>
  );
}

export default All;
