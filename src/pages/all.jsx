import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/globalContext";
import { Toaster, toast } from "react-hot-toast";
import Loading from "../components/Loading";
import Navbar from "../components/navbar";
import { supabase } from "../supabaseClient";
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
      "status",
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

    // Sort data based on the "status" column, putting "pending" values at the top
    const sortedData = data.sort((a, b) => {
      if (a.status === b.status) {
        return b.id - a.id; // If statuses are the same, sort by id in descending order
      }
      return a.status === "pending" ? -1 : 1; // Sort "pending" values first
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

    return finalColumns;
  };

  const getData = async () => {
    setLoading(true);

    try {
      const { data, err } = await supabase
        .from("queries")
        .select("*")
        .eq("query_type", queryType);
      if (err) {
        toast.error(err.message);
        console.error("Supabase error:", err);
      } else {
        // console.log("all data", data);
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
        // console.log("data", processedData);
        // console.log("unique columns", uniqueColumns);

        toast.dismiss();
        toast.success("Fetched");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Supabase error:", err);
    } finally {
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
    if (userInfo?.email) getData();
  }, [userInfo?.email, queryType]);

  return (
    <>
      <Navbar />
      <div className="flex flex-row gap-3 items-center justify-center  w-fit">
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
        data && columns && <TableRenderer data={data} columns={columns} />
      )}
    </>
  );
}

export default All;
