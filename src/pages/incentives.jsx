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
        const courseMatched = item.CourseName === 'UPSC Prelims Topic-Wise Solved PYQs (2011 - 2024) Book';
        const emailMatched = item.email === userEmail;

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
        data={incentivesData.map(({ OrgID, CourseID, CourseName, Course_URL, TransDate, UserID, PaymentID, Amount_Paid, Current_CoursePrice, transactionid, InstallmentType, Backend_Trans, CouponDiscount, name, mobile, email, expiryDate, isExpired, ShipmentAdreess, DateofPurchase, TrackingID, CourierCompany }) => ({
          OrgID,
          CourseID,
          CourseName,
          Course_URL,
          TransDate,
          UserID,
          PaymentID,
          Amount_Paid: Amount_Paid ? parseFloat(Amount_Paid).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          }) : 'N/A',
          Current_CoursePrice: Current_CoursePrice ? parseFloat(Current_CoursePrice).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          }) : 'N/A',
          transactionid,
          InstallmentType,
          Backend_Trans,
          CouponDiscount,
          name,
          mobile,
          email,
          expiryDate,
          isExpired,
          ShipmentAdreess,
          DateofPurchase,
          TrackingID,
          CourierCompany
        }))}
        columns={[
          { header: 'Tracking ID', accessor: 'TrackingID' },
          { header: 'Courier Company', accessor: 'CourierCompany' },
          { header: 'Course Name', accessor: 'CourseName' },
          { header: 'Student Name', accessor: 'name' },
          { header: 'Student Mobile Number', accessor: 'mobile'},
          { header: 'Date of Purchase', accessor: 'DateofPurchase' },
          { header: 'Shipment Adreess', accessor: 'ShipmentAdreess'}
          // { header: 'Course_URL', accessor: 'Course_URL' },
          // { header: 'TransDate', accessor: 'TransDate' },
          // { header: 'UserID', accessor: 'UserID' },
          // { header: 'PaymentID', accessor: 'PaymentID' },
          // { header: 'Amount_Paid', accessor: 'Amount_Paid' },
          // { header: 'Current_CoursePrice', accessor: 'Current_CoursePrice' },
          // { header: 'transactionid', accessor: 'transactionid' },
          // { header: 'InstallmentType', accessor: 'InstallmentType' },
          // { header: 'Backend_Trans', accessor: 'Backend_Trans' },
          // { header: 'CouponDiscount', accessor: 'CouponDiscount' },
          // { header: 'name', accessor: 'name' },
          // { header: 'mobile', accessor: 'mobile'},
          // { header: 'email', accessor: 'email'},
          // { header: 'expiryDate', accessor: 'expiryDate'},
          // { header: 'isExpired', accessor: 'isExpired'},
          
        ]}
      />
    </div>
  );
}