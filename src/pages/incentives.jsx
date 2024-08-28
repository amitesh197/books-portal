import React, { useEffect, useState } from 'react';
import { fetchGoogleSheetData } from '../api/fetchGoogleSheetData';
import IncentiveTable from '../components/IncentiveTable';
import Loading from '../components/Loading';

export default function Incentives() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [incentivesData, setIncentivesData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [agents, setAgents] = useState([]);
  const [months, setMonths] = useState([]);

  const agentMapping = {
    AKR: 'AKR',
    MBM: 'Manisha',
    KKS: 'Sweta',
    RAM: 'Ram Pandey',
    IRF: 'Irfan',
    SRI: 'Srishti Verma',
    TEZ: 'TEZ',
    ANC: 'Anchal Verma',
    MOH: 'Mohit Vats',
    HAR: 'Harshit Mishra',
    THI: 'Sanjay',
    RKS: 'Shivani',
    APU: 'Apurva',
    SAR: 'Sajal',
    KCV: 'Sonam',
    RKT: 'Ravi',
    NIK: 'Nikhil',
    PUR: 'Purusharth',
    APS: 'Abhay',
    shivin: 'shivin',
    oldstudent: 'oldstudent',
    STUDENTPOWER: 'STUDENTPOWER',
    MMP: 'MMP'
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await fetchGoogleSheetData();
        processData(fetchedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    const processData = (fetchedData) => {
      const incentivesMap = {};
      const monthsSet = new Set();

      fetchedData.forEach((item) => {
        const couponCode = item.couponCode;
        const transDate = item.TransDate; // Ensure this is properly formatted
        const month = new Date(transDate).toLocaleString('default', { month: 'long', year: 'numeric' });

        if (couponCode && typeof couponCode === 'string') {
          const agentName = agentMapping[couponCode.substring(0, 3)] || couponCode.substring(0, 3);
          const courseName = item.courseName;
          const amountPaid = parseFloat(item.amount_paid) || 0;

          if (!incentivesMap[agentName]) {
            incentivesMap[agentName] = {};
          }

          if (!incentivesMap[agentName][courseName]) {
            incentivesMap[agentName][courseName] = {
              count: 0,
              totalRevenue: 0,
              months: new Set() // Track months for each agent-course pair
            };
          }

          incentivesMap[agentName][courseName].count += 1;
          incentivesMap[agentName][courseName].totalRevenue += amountPaid;
          incentivesMap[agentName][courseName].months.add(month);
          monthsSet.add(month);
        }
      });

      const formattedData = Object.entries(incentivesMap).flatMap(([agentName, courses]) => {
        return Object.entries(courses).flatMap(([courseName, { count, totalRevenue, months }]) => {
          const row = {
            agentName,
            courseName,
            count,
            totalRevenue
          };

          return Array.from(months).map(month => ({
            ...row,
            month
          }));
        });
      });

      setIncentivesData(formattedData);

      const uniqueAgents = Array.from(new Set(formattedData.map(item => item.agentName)));
      setAgents(['All', ...uniqueAgents]);

      setMonths(['All', ...Array.from(monthsSet)]); // Include 'All' option
    };

    getData();
  }, []);

  const handleAgentChange = (event) => {
    setSelectedAgent(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filteredData = incentivesData
    .filter(item => (selectedAgent === 'All' || item.agentName === selectedAgent) &&
                     (selectedMonth === 'All' || item.month === selectedMonth));

  // Calculate totals
  const totalCourses = filteredData.reduce((acc, item) => acc + item.count, 0);
  const totalRevenue = filteredData.reduce((acc, item) => acc + item.totalRevenue, 0);

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    // Implement navigation or display logic for detailed transactions
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="table-container">
      <h1 className="text-xl font-semibold w-full text-center my-2">
        Incentives Summary
      </h1>
      
      <div className="flex justify-between mb-4">
        <div className="flex flex-col">
          <label htmlFor="agentDropdown" className="mb-1 font-semibold">Agent Name</label>
          <select 
            id="agentDropdown" 
            value={selectedAgent} 
            onChange={handleAgentChange} 
            className="p-2 border"
          >
            {agents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="monthDropdown" className="mb-1 font-semibold">Month</label>
          <select 
            id="monthDropdown" 
            value={selectedMonth} 
            onChange={handleMonthChange} 
            className="p-2 border"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Totals Display */}
      <div className="totals-display mb-4">
        <div className="total-courses">
          <strong>Total Courses: </strong>{totalCourses}
        </div>
        <div className="total-revenue">
          <strong>Total Revenue: </strong>{totalRevenue.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          })}
        </div>
      </div>

      <IncentiveTable
        data={filteredData.map(({ agentName, courseName, count, totalRevenue }) => ({
          agentName,
          courseName,
          count,
          totalRevenue: totalRevenue.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          }),
        }))}
        columns={[
          { header: 'Agent Name', accessor: 'agentName' },
          { header: 'Course Name', accessor: 'courseName' },
          { header: 'Total Courses', accessor: 'count' },
          { header: 'Total Revenue', accessor: 'totalRevenue' }
        ]}
        onRowClick={handleRowClick}
      />
    </div>
  );
}