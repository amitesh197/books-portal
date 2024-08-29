import React, { useEffect, useState } from 'react';
import { fetchGoogleSheetData } from '../api/fetchGoogleSheetData';
import IncentiveTable from '../components/IncentiveTable';
import Loading from '../components/Loading';
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../UserPool"; // Your UserPool configuration
import '../stylesheets/query_table/Incentives.scss';

export default function Incentives() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [incentivesData, setIncentivesData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [agents, setAgents] = useState([]);
  const [months, setMonths] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Email to agent name mapping
  const emailToAgentMapping = {
    "amiteshs197@gmail.com": "AMIT",
    "manishabansal788@gmail.com": "Manisha",
    "rkpandey817@gmail.com": "Ram Pandey",
    "irfanmindbrink@gmail.com": "Irfan",
    "sristiverma.rbj@gmail.com": "Srishti Verma",
    "vermaanchalkumari@gmail.com": "Anchal Verma",
    "mohitvats01@gmail.com": "Mohit Vats",
    "harshmishra363@gmail.com": "Harshit Mishra",
    "sanjaysinghrajawat23#gmail.com": "Sanjay",
    "shivani.sharma.7194@gmail.com": "Shivani",
    "apurva000730@gmail.com": "Apurva",
    "advaitsajal@gmail.com": "Sajal",
    "sonam.edsarrthi99@gmail.com": "Sonam",
    "ravikumartanti2@gmail.com": "Ravi",
    "nikhil2906kumar@gmail.com": "Nikhil",
    "puru.attrish24@gmail.com": "Purusharth",
    "iabhaysingh15@gmail.com": "Abhay",
    "swedhakarnani21@gmail.com": "Swedha Karnani",
    "shinusuman10@gmail.com": "Sneha"
    // Add other email to agent mappings here
  };

  // Define agent mapping
  const agentMapping = {
    AKR: 'AKR',
    MBM: 'Manisha',
    KKS: 'Swedha Karnani',
    RAM: 'Ram Pandey',
    IRF: 'Irfan',
    SRI: 'Srishti Verma',
    TEZ: 'Sneha',
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
    MMP: 'MMP',
    AMI: "AMIT"
  };

  useEffect(() => {
    const getUserInfo = () => {
      const userInfoString = sessionStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : {};

      const email = userInfo.email || 'unknown';
      const isAdmin = userInfo.isAdmin || false;
      const token = userInfo.token || '';

      setIsAdmin(isAdmin);
      if (!isAdmin) {
        const agentName = emailToAgentMapping[email];
        setCurrentAgent(agentName);
      }
    };

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
        const transDate = item.TransDate;
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
              months: new Set()
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

      setMonths(['All', ...Array.from(monthsSet)]);
    };

    getUserInfo();
    getData();
  }, []);

  const handleAgentChange = (event) => {
    setSelectedAgent(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const handlePasswordSubmit = () => {
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : {};
  
    const email = userInfo.email || 'unknown';
    const isAdmin = userInfo.isAdmin || false;
  
    if (!email || email === 'unknown') {
      alert('Email not found in session storage');
      return;
    }
  
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: passwordInput,
    });
  
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });
  
    user.authenticateUser(authDetails, {
      onSuccess: async (loginData) => {
        const accessToken = loginData.getAccessToken().getJwtToken();
        const accessTokenPayload = loginData.getAccessToken().payload;
  
        const newIsAdmin = accessTokenPayload["cognito:groups"]?.includes("admins") || isAdmin;
  
        setIsAuthenticated(true);
        setIsAdmin(newIsAdmin);
  
        sessionStorage.setItem(
          'userInfo',
          JSON.stringify({
            username: loginData.accessToken.payload.username,
            email: loginData.idToken.payload.email,
            token: accessToken,
            isAdmin: newIsAdmin,
          })
        );
      },
      onFailure: (err) => {
        alert('Incorrect password');
      },
    });
  };
  
  const filteredData = incentivesData
    .filter(item => (isAdmin || (isAuthenticated && item.agentName === currentAgent)) &&
      (selectedAgent === 'All' || item.agentName === selectedAgent) &&
      (selectedMonth === 'All' || item.month === selectedMonth)) || [];
  
  const totalCourses = filteredData.reduce((acc, item) => acc + item.count, 0);
  const totalRevenue = filteredData.reduce((acc, item) => acc + item.totalRevenue, 0);
  
  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    // Implement navigation or display logic for detailed transactions
  };
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (!isAdmin && !isAuthenticated) {
    return (
      <div className="password-container">
        <div className="password-box">
          <h2 className="password-title">Enter Password</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter your password"
            className="password-input"
          />
          <button
            onClick={handlePasswordSubmit}
            className="password-button"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <h1 className="header">Incentives Summary</h1>
      
      <div className="filter-container">
        {isAdmin && (
          <div className="filter-group">
            <label htmlFor="agentDropdown" className="filter-label">Agent Name</label>
            <select 
              id="agentDropdown" 
              value={selectedAgent} 
              onChange={handleAgentChange} 
              className="filter-select"
            >
              {agents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>
        )}
  
        <div className="filter-group">
          <label htmlFor="monthDropdown" className="filter-label">Month</label>
          <select 
            id="monthDropdown" 
            value={selectedMonth} 
            onChange={handleMonthChange} 
            className="filter-select"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>
  
      <div className="summary">
        <div className="summary-item">
          <strong>Total Courses: </strong>{totalCourses}
        </div>
        <div className="summary-item">
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