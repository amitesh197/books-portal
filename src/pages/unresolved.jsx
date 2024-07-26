import React, {useEffect, useState} from "react";
import {useGlobalContext} from "../context/globalContext";
import {Toaster, toast} from "react-hot-toast";
import Loading from "../components/Loading";
import Navbar from "../components/navbar";
import TableRenderer from "../components/TableRenderer";

function Unresolved() {
    const {userInfo, queryType, setQueryType} = useGlobalContext();
    const [data, setData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFilteredColumns = (data) => {
        // Columns to always show

        const alwaysShowColumns = [
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
            "query_type",
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
            "deviceName",
            "deviceSpecs",
            "file",

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

        // Filter out columns that are not in the "alwaysShowColumns" array and have all values null
        let filteredColumns = sortedColumns.filter(
            (column) =>
                alwaysShowColumns.includes(column.id) ||
                data.some((response) => response[column.id] !== null)
        );

        filteredColumns = filteredColumns.filter((column) => {
            // Check if all values for this column are empty or null
            const allValuesEmptyOrNull = data.every(
                (response) => response[column.id] == "" || response[column.id] == null
            );
            return !allValuesEmptyOrNull;
        });

        //remove the id column and query type column
        filteredColumns = filteredColumns.filter(
            (column) => column.id !== "id" && column.id !== "query_type"  && column.id !== "type"  && column.id !== "createdAt"
        );

        if (!userInfo?.isAdmin) {
            //remove the taken_by column
            filteredColumns = filteredColumns.filter(
                (column) => column.id !== "taken_by"
            );
        }
        // console.log(filteredColumns);
        // Add a "Delete" column at the end
        const deleteColumn = {
            id: "delete",
            header: "Delete",
            accessorKey: "delete",
            footer: "Delete",
            cell: ({row}) => (
                <td className="delete-cell" key={`delete-${row.id}`}>
                    <button onClick={() => handleDelete(row.original.id)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            ),
        };

        let finalColumns;
        //add delete column
        finalColumns = [...filteredColumns, deleteColumn];
        return finalColumns;
    };

    const handleDelete = async (rowId) => {
        toast.loading("Deleting row", rowId);
        try {
            // Send a delete query to dynamodb
            const response = await fetch(
                "https://vhwkobs58j.execute-api.ap-south-1.amazonaws.com/dev/queries/",
                {
                    method: "DELETE",
                    body: JSON.stringify({id: rowId}),
                    // or 'POST' or other HTTP methods
                }
            );
            if (!response.ok) {
                throw new Error(`${response.type} error! Status: ${response.status}`);
            }
            getData({withToast: false});
            toast.dismiss();
            toast.success("Deleted !");
        } catch (error) {
            //clear toast
            toast.dismiss();
            toast.error(error.message);
            console.error("error:", error);
        }
    };

    const getData = async ({withToast}) => {
        setLoading(true);
        // toast.loading("Fetching...");
        setData(null);
        console.log("Fetching data...");
        try {
            // Display a loading message or spinner if needed
            toast.loading("Fetching data...");

            const response = await fetch(
                "https://vhwkobs58j.execute-api.ap-south-1.amazonaws.com/dev/queries/",
                {
                    method: "POST",
                    body: JSON.stringify({type: "getData", queryType: queryType}),
                }
            );
            // Check if the response is successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`${response.type} error! Status: ${response.status}`);
            }

            // Parse the response as JSON
            let data = await response.json();
            // console.log("All data:", data);

            const processedData = data.map((each) => {
                const dateObject = new Date(each.date);
                const day = String(dateObject.getDate()).padStart(2, "0");
                const month = String(dateObject.getMonth() + 1).padStart(2, "0");
                const year = String(dateObject.getFullYear()).slice(2);
                each.date = `${day}/${month}/${year}`;
                return each;
            });

            //sort according to id
            processedData.sort((a, b) => {
                return b.id - a.id;
            });
            // Sort data based on the "status" column and id, putting "done" values at the end
            let sortedData = processedData.sort((a, b) => {
                const statusA = a.status.toLowerCase();
                const statusB = b.status.toLowerCase();

                if (statusA === "done" && statusB !== "done") {
                    return 1; // "Done" values go at the end
                }
                if (statusA !== "done" && statusB === "done") {
                    return -1; // "Done" values go at the end
                }

                if (statusA === statusB) {
                    return b.id - a.id; // If statuses are the same, sort by id in descending order
                }
            });

            // Filter out the data based on the query type if status is "Pending"

            sortedData = sortedData.filter(
                (row) =>  row.status === "Pending"
            );
            // If the user is not an admin, further filter based on taken_by = userInfo.email
            if (!userInfo?.isAdmin) {
                sortedData = sortedData.filter(
                    (row) => row.taken_by === userInfo.email
                );
            }
            setData(sortedData);

            setColumns(getFilteredColumns(sortedData));

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


    const updateRow = (rowId, updatedFields) => {
        setData(prevData =>
            prevData.map(row =>
                row.id === rowId ? {...row, ...updatedFields} : row
            )
        );
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
        if (userInfo?.email) getData({withToast: true});
    }, [userInfo?.email, queryType]);

    return (
        <div className="p-2 ">
            <Navbar/>
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
                    <option value="technicalIssue">Technical Issue</option>

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
                <Loading/>
            ) : data?.length == 0 ? (
                <p className="text-xl  mt-5 text-center w-full">
                    No Data of the selected type found.
                </p>
            ) : (
                data &&
                columns && (
                    <TableRenderer updateRow={updateRow}
                                   data={data} columns={columns} getData={getData}/>
                )
            )}
        </div>
    );
}

export default Unresolved;
