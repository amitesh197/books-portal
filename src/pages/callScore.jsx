import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useGlobalContext } from "../context/globalContext";
import Loading from "../components/Loading";
import TableRenderer from "../components/TableRenderer";

function CallScore() {
    const { userInfo } = useGlobalContext();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const AWS_API_ENDPOINT = import.meta.env.VITE_AWS_ENDPOINT_CALLS || "";
    const [selectedWeek, setSelectedWeek] = useState('Week 1');
    const [selectedAgent, setSelectedAgent] = useState('All Agents');
    const [qualityScores, setQualityScores] = useState({});

    const agentsList = [
        "Sneha",
        "Purusharth",
        "Sanjay Rajawat",
        "Irfan",
        "Shivani",
        "MohitVats",
        "Ravi",
        "Apurva",
        "Anchal",
        "Khushboo",
        "Sajal",
        "RAM",
        "Sarthak",
        "Ankit Kumar",
        "Sonam",
        "Swedha",
        "Manisha",
        "Sristi Verma",
        "Nikhil Kumar",
        "Harshit Mishra",
        "Ankit Singh"
    ];

    const calculateScores = (totalCalls, totalDuration) => {
        const avgCallsPerWeek = Math.round(totalCalls / 7);
        const avgTalkTime = Math.round(totalDuration / 7);

        let callScore = 0;
        if (avgCallsPerWeek >= 115 && avgCallsPerWeek <= 125) {
            callScore = 1;
        } else if (avgCallsPerWeek >= 126 && avgCallsPerWeek <= 150) {
            callScore = 2;
        } else if (avgCallsPerWeek > 150) {
            callScore = 3;
        }

        let talkTimeScore = 0;
        if (avgTalkTime >= 5400 && avgTalkTime <= 7200) {
            talkTimeScore = 1;
        } else if (avgTalkTime > 7200 && avgTalkTime <= 9000) {
            talkTimeScore = 2;
        } else if (avgTalkTime > 9000) {
            talkTimeScore = 3;
        }

        return {
            avgCallsPerWeek,
            avgTalkTime,
            callScore,
            talkTimeScore,
        };
    };

    const getWeekDateRange = (selectedWeek) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed
        const startOfMonth = new Date(year, month, 1);

        const weekMapping = {
            'Week 1': [1, 7],
            'Week 2': [8, 14],
            'Week 3': [15, 21],
            'Week 4': [22, 28],
            'Week 5': [29, new Date(year, month + 1, 0).getDate()],
        };

        const [startDay, endDay] = weekMapping[selectedWeek];
        const startDate = new Date(year, month, startDay);
        const endDate = new Date(year, month, endDay);

        return { startDate, endDate };
    };

    const getData = async (agentName, selectedWeek) => {
        setLoading(true);
        setData([]);
        try {
            const { startDate, endDate } = getWeekDateRange(selectedWeek);
            console.log(`Fetching data for Agent: ${agentName}, Week: ${selectedWeek}, Dates: ${startDate.toDateString()} - ${endDate.toDateString()}`);

            // Convert to IST
            const istStartDate = new Date(startDate.getTime() + (5.5 * 60 * 60 * 1000));
            const istEndDate = new Date(endDate.getTime() + (5.5 * 60 * 60 * 1000));
            const formattedStartDate = istStartDate.toISOString().split('T')[0];
            const formattedEndDate = istEndDate.toISOString().split('T')[0];

            const fetchAgentData = async (agent) => {
                const body = {
                    query_type: "getData",
                    agent_name: agent.toString().toLowerCase().replace(" ", "_"),
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                };

                console.log("Request body:", body);

                try {
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

                    if (responseData.error || responseData.length === 0) {
                        toast.error(`No data found for agent ${agent}.`);
                        return null;
                    }

                    // Aggregate data
                    const totalCalls = responseData.reduce((acc, row) => acc + (row.total_calls || 0), 0);
                    const totalDuration = responseData.reduce((acc, row) => acc + (row.duration || 0), 0);
                    console.log(`Total Calls: ${totalCalls}, Total Duration: ${totalDuration}`);

                    const scores = calculateScores(totalCalls, totalDuration);
                    console.log("Calculated Scores:", scores);

                    const qualityScore = qualityScores[agent] || 0;

                    return {
                        agent_name: agent,
                        avgCallsPerWeek: scores.avgCallsPerWeek,
                        callScore: scores.callScore,
                        avgTalkTime: scores.avgTalkTime,
                        talkTimeScore: scores.talkTimeScore,
                        qualityScore,
                        totalScore: scores.callScore + scores.talkTimeScore + qualityScore,
                    };
                } catch (err) {
                    toast.error(`Error fetching data for agent ${agent}: ${err.message}`);
                    console.error(`Error fetching data for agent ${agent}:`, err);
                    return null;
                }
            };

            if (agentName === "All Agents") {
                const allDataPromises = agentsList.map(fetchAgentData);
                const allData = await Promise.all(allDataPromises);
                const filteredData = allData.filter(item => item !== null);
                setData(filteredData);
            } else {
                const agentData = await fetchAgentData(agentName);
                if (agentData) {
                    setData([agentData]);
                }
            }

            toast.success("Data fetched successfully!");

        } catch (err) {
            toast.error(err.message);
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const handleWeekChange = (e) => {
        const week = e.target.value;
        setSelectedWeek(week);
    };

    const handleAgentChange = (e) => {
        const agent = e.target.value;
        setSelectedAgent(agent);
    };

    const handleQualityScoreChange = (e, agentName) => {
        const score = parseInt(e.target.value);
        setQualityScores(prevScores => ({
            ...prevScores,
            [agentName]: score
        }));

        setData(prevData => prevData.map(row => {
            if (row.agent_name === agentName) {
                const newTotalScore = row.callScore + row.talkTimeScore + score;
                return { ...row, qualityScore: score, totalScore: newTotalScore };
            }
            return row;
        }));
    };

    const getColumns = () => {
        return [
            { Header: 'Agent Name', accessor: 'agent_name' },
            { Header: 'Avg Calls/Week', accessor: 'avgCallsPerWeek' },
            { Header: 'Call Score', accessor: 'callScore' },
            { Header: 'Avg Talk Time (secs)', accessor: 'avgTalkTime' },
            { Header: 'Talk Time Score', accessor: 'talkTimeScore' },
            {
                Header: 'Quality Score',
                accessor: 'qualityScore',
                Cell: ({ value, row }) => (
                    <select
                        value={value}
                        onChange={(e) => handleQualityScoreChange(e, row.original.agent_name)}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                )
            },
            { Header: 'Total Score', accessor: 'totalScore' },
        ];
    };
    useEffect(() => {
        if (userInfo?.email) {
            getData(selectedAgent, selectedWeek);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo?.email, selectedAgent, selectedWeek]);

    return (
        <div className="p-4 w-full">
            <Toaster
                position="bottom-left"
                toastOptions={{
                    style: {
                        background: "#ff8e00",
                        color: "#2e2c2d",
                    },
                    success: {
                        duration: 2000,
                    },
                }}
            />
            <h1 className="text-2xl font-bold text-center mb-6">Call Score</h1>
            <div className="flex justify-center mb-6">
                <div className="mr-4">
                    <label className="mr-2 font-semibold">Select Week:</label>
                    <select
                        className="mx-3 px-3 py-2 rounded border border-theme-yellow-light cursor-pointer"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                    >
                        <option value="Week 1">Week 1 (Date 1-7)</option>
                        <option value="Week 2">Week 2 (Date 8-14)</option>
                        <option value="Week 3">Week 3 (Date 15-21)</option>
                        <option value="Week 4">Week 4 (Date 22-28)</option>
                        <option value="Week 5">Week 5 (Date 29-31)</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2 font-semibold">Select Agent:</label>
                    <select
                        className="mx-3 px-3 py-2 rounded border border-theme-yellow-light cursor-pointer"
                        value={selectedAgent}
                        onChange={handleAgentChange}
                    >
                        <option value="All Agents">All Agents</option>
                        {agentsList.map(agent => (
                            <option key={agent} value={agent}>{agent}</option>
                        ))}
                    </select>
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : data.length === 0 ? (
                <p className="text-xl text-center mt-10">No Data Found for the Selected Filters.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                {getColumns().map((column) => (
                                    <th
                                        key={column.Header}
                                        className="py-2 px-4 border-b"
                                        style={{ backgroundColor: '#EEAF50' }}
                                    >
                                        {column.Header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border-b">{row.agent_name}</td>
                                    <td className="py-2 px-4 border-b">{row.avgCallsPerWeek}</td>
                                    <td className="py-2 px-4 border-b">{row.callScore}</td>
                                    <td className="py-2 px-4 border-b">
                                        {row.avgTalkTime} <br />
                                        ({formatTime(row.avgTalkTime)})
                                    </td>
                                    <td className="py-2 px-4 border-b">{row.talkTimeScore}</td>
                                    <td className="py-2 px-4 border-b">
                                        <select
                                            value={row.qualityScore}
                                            onChange={(e) => handleQualityScoreChange(e, row.agent_name)}
                                            className="border px-2 py-1 rounded"
                                        >
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border-b">{row.totalScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CallScore;
