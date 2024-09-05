import axios from "axios";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { toast, Toaster } from "react-hot-toast";
import Modal from 'react-modal';
import Loading from "../components/Loading";
import TableRenderer from "../components/TableRenderer";
import TotalsSummary from "../components/TotalsSummary.jsx";
import { useGlobalContext } from "../context/globalContext";

function Dashboard() {
    const { userInfo } = useGlobalContext();
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const AWS_API_ENDPOINT = import.meta.env.VITE_AWS_ENDPOINT_CALLS || "";
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });
    const [selectedAgent, setSelectedAgent] = useState('All');
    const [showCalendar, setShowCalendar] = useState(false);
    const [totals, setTotals] = useState({});

    const calculateTotals = (data) => {
        const uniqueAgents = Array.from(new Set(data.map(row => row.agent_name)));
        const agentCount = uniqueAgents.length;
    
        const totals = data.reduce((totals, row) => {
            totals.total_calls += row.total_calls || 0;
            totals.duration += row.duration || 0;
            totals.oc_answered += row.oc_answered || 0;
            totals.oc_missed += row.oc_missed || 0;
            totals.ic_answered += row.ic_answered || 0;
            totals.ic_missed += row.ic_missed || 0;
            totals.agent_count = agentCount;
            totals.total_rows += 1; // Increment the row count to calculate averages
            return totals;
        }, {
            total_calls: 0,
            duration: 0,
            oc_answered: 0,
            oc_missed: 0,
            ic_answered: 0,
            ic_missed: 0,
            agent_count: 0,
            total_rows: 0 // Track the total number of rows
        });
    
        totals.avg_calls = totals.total_rows ? (totals.total_calls / totals.total_rows) : 0;
        totals.avg_duration = totals.total_rows ? (totals.duration / totals.total_rows) : 0;
    
        return totals;
    };
    
    const getFilteredColumns = (data) => {
        const columnOrder = [
            "date",
            "agent_name",
            "total_calls",
            "duration",
            "oc_answered",
            "oc_missed",
            "ic_answered",
            "ic_missed",
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
        let sortedColumns = uniqueColumns.sort(
            (a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id)
        );
        return sortedColumns;
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    function handleSelectDateRange(date) {
        const startDate = new Date(date.selection.startDate);
        const endDate = new Date(date.selection.endDate);

        // Set the start time to 00:00:00
        startDate.setHours(0, 0, 0, 0);

        // Set the end time to 11:59:59
        endDate.setHours(23, 59, 59, 999);

        setSelectionRange({
            startDate,
            endDate,
            key: 'selection',
        });
        console.log(startDate, endDate);
        getData(selectedAgent, startDate, endDate);
        // Close the calendar
        toggleCalendar();

    }

    function handleSelectAgent(agent) {
        setSelectedAgent(agent);
        // console.log(selectedAgent);
        getData(agent, selectionRange.startDate, selectionRange.endDate);
    }
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${seconds} (${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s)`;
    };
    const getData = async (agentName, startDate, endDate) => {
        setLoading(true);
        setData(null);
        try {
            // Convert startDate and endDate to IST
            const istStartDate = new Date(startDate.getTime() + (5.5 * 60 * 60 * 1000));
            const istEndDate = new Date(endDate.getTime() + (5.5 * 60 * 60 * 1000));
            const formattedStartDate = istStartDate.toISOString().split('T')[0];
            const formattedEndDate = istEndDate.toISOString().split('T')[0];
            const body = {
                query_type: "getData",
                agent_name: agentName.toString().toLowerCase().replace(" ", "_"),
                start_date: formattedStartDate,
                end_date: formattedEndDate,
            };


            // console.log("Request body:", body);

            const response = await axios.post(
                AWS_API_ENDPOINT,
                JSON.stringify(body),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const responseData = JSON.parse(response.data);
            console.log("Response data:", responseData);
            /*
            Response data format:
            [
                {
                    "date": "2024-07-29",
                    "ic_missed": 0,
                    "oc_missed": 7,
                    "agent_name": "mohitvats",
                    "total_calls": 10,
                    "ic_answered": 0,
                    "oc_answered": 3,
                    "duration": 106
                },
                ...
            ]
             */
            if (responseData.error) {
                toast.error("No data found for the selected date range or agent. Please try again.");
                return;
            }

            const formattedData = responseData.map(row => ({
                ...row,
                duration: formatDuration(row.duration)
            }));

            let sortedData = formattedData.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            setData(sortedData);
            setColumns(getFilteredColumns(sortedData));
            const calculatedTotals = calculateTotals(responseData);
            setTotals(calculatedTotals);
            toast.success();

        } catch (err) {
            toast.error(err.message);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateRow = (rowId, updatedFields) => {
        setData(prevData =>
            prevData.map(row =>
                row.id === rowId ? { ...row, ...updatedFields } : row
            )
        );
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: "#505050", // darker gray
            border: "none",
            borderRadius: "10px",
            padding: "0",
        },
    };

    useEffect(() => {
        if (userInfo?.email) {
            getData(selectedAgent, selectionRange.startDate, selectionRange.endDate);
        }
    }, [userInfo?.email]);

    return (
        <div className=" p-2 w-full">
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
            <Modal style={customStyles} appElement={document.getElementById('root')} isOpen={showCalendar}
                onRequestClose={toggleCalendar}>
                <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={handleSelectDateRange}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    direction="horizontal"
                />
            </Modal>
            <div>
                <h1 className="text-2xl font-bold w-full text-center">Dashboard</h1>

                <button className="bg-theme-yellow-light text-black rounded px-3 py-2 hover:bg-theme-yellow-dark"
                    onClick={toggleCalendar}>Show Calendar
                </button>
                <select className="mx-3 px-3 py-2 rounded border border-theme-yellow-light cursor-pointer"
                    onChange={(e) => {
                        handleSelectAgent(e.target.value)
                        // console.log(selectedAgent);
                    }}>
                    <option value="">Select Agent</option>
                    <option value="All">All</option>
                    <option value="Purusharth">Purusharth</option>
                    <option value="Sanjay Rajawat">Sanjay Rajawat</option>
                    <option value="Irfan">Irfan</option>
                    <option value="Shivani">Shivani</option>
                    <option value="MohitVats">MohitVats</option>
                    <option value="Ravi">Ravi</option>
                    <option value="Apurva">Apurva</option>
                    <option value="Anchal">Anchal</option>
                    <option value="Khushboo">Khushboo</option>
                    <option value="Sajal">Sajal</option>
                    <option value="Sneha">Sneha</option>
                    <option value="RAM">RAM</option>
                    <option value="Sarthak">Sarthak</option>
                    <option value="Ankit Kumar">Ankit Kumar</option>
                    <option value="Sonam">Sonam</option>
                    <option value="Swedha">Swedha</option>
                    <option value="Manisha">Manisha</option>
                    <option value="Sristi Verma">Sristi Verma</option>
                    <option value='Nikhil Kumar'>Nikhil Kumar</option>
                    <option value='Harshit Mishra'>Harshit Mishra</option>
                    <option value="Ankit Singh">Ankit Singh</option>
                </select>
                <div className="p-2">
                    <div>Date Range:
                        <span
                            className="text-lg font-bold ml-2">{selectionRange.startDate.toDateString()} - {selectionRange.endDate.toDateString()}</span>
                    </div>
                    <div>Agent:
                        <span className="text-lg font-bold ml-2">{selectedAgent}</span>
                    </div>

                </div>
            </div>
            {loading && !data ? (
                <Loading />
            ) : data?.length === 0 ? (
                <p className="text-xl  mt-5 text-center w-full">
                    No Data of the selected type found.
                </p>
            ) : (
                data && <>
                    <TableRenderer data={data} columns={columns} updateRow={updateRow} />
                    <TotalsSummary totals={totals} />
                </>

            )}
        </div>
    );
}

export default Dashboard;
