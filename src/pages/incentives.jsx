import React, { useEffect, useState } from 'react';
import { fetchGoogleSheetData } from '../api/fetchGoogleSheetData';
import IncentiveTable from '../components/IncentiveTable';
import Loading from '../components/Loading';
import '../stylesheets/query_table/Incentives.scss';

export default function Incentives() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [incentivesData, setIncentivesData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user info from sessionStorage
    const getUserInfo = () => {
      const userInfoString = sessionStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : {};

      const email = userInfo.email || 'unknown';
      const isAdmin = userInfo.isAdmin || false;
      setUserEmail(email);
      setIsAdmin(isAdmin);
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

    // Process and filter data based on course and user email
    const processData = (fetchedData) => {
      const filteredData = fetchedData.filter(item => {
        const courseMatched = item.Course === 'UPSC Prelims Topic-Wise Solved PYQs (2011 - 2024) Book';
        const emailMatched = item.Email === userEmail;

        if (isAdmin) {
          return courseMatched;  // Admin sees all rows for the matched course
        }
        return courseMatched && emailMatched;  // Regular users see only their data
      });

      setIncentivesData(filteredData);
    };

    getUserInfo();
    getData();
  }, [userEmail, isAdmin]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <h1 className="header">Books Order Transaction</h1>

      <div className="summary">
        <div className="summary-item">
          <strong>Total Records: </strong>{incentivesData.length}
        </div>
      </div>

      <IncentiveTable
        data={incentivesData.map(({ Name, Email, 'Phone Number': PhoneNumber, Course, Date, Amount, 'Coupon Code': CouponCode, 'Tracking ID': TrackingID, Address, 'Courier Company': CourierCompany }) => ({
          Name,
          Email,
          PhoneNumber,
          Course,
          Date,
          Amount: Amount ? parseFloat(Amount).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          }) : 'N/A',
          CouponCode,
          TrackingID,
          Address,
          CourierCompany
        }))}
        columns={[
          { header: 'Name', accessor: 'Name' },
          { header: 'Email', accessor: 'Email' },
          { header: 'Phone Number', accessor: 'PhoneNumber' },
          { header: 'Course', accessor: 'Course' },
          { header: 'Date', accessor: 'Date' },
          { header: 'Amount', accessor: 'Amount' },
          { header: 'Coupon Code', accessor: 'CouponCode' },
          { header: 'Tracking ID', accessor: 'TrackingID' },
          { header: 'Address', accessor: 'Address' },
          { header: 'Courier Company', accessor: 'CourierCompany' },
        ]}
      />
    </div>
  );
}
