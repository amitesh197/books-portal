import React, { useEffect, useState } from 'react';
import { fetchGoogleSheetData } from '../api/fetchGoogleSheetData';
import IncentiveTable from '../components/IncentiveTable';
import Loading from '../components/Loading';
import '../stylesheets/query_table/Incentives.scss';

export default function Incentives() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const getUserInfo = () => {
      const userInfoString = sessionStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : {};
      setUserEmail(userInfo.email || 'unknown');
      setIsAdmin(userInfo.isAdmin || false);
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching data from Google Sheets...');
        const fetchedData = await fetchGoogleSheetData();
        console.log('Fetched Data:', fetchedData);

        // Filter data based on admin status and user email
        const filteredData = isAdmin
          ? fetchedData
          : fetchedData.filter(item =>
            item.CourseName === 'UPSC Prelims Topic-Wise Solved PYQs (2011 - 2024) Book' &&
            item.email === userEmail
          );

        console.log('Filtered Data:', filteredData);
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optional: Show an error message or fallback UI
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
    fetchData();

  }, [userEmail, isAdmin]);

  const handleUpdate = async (email, trackingID, courierCompany) => {
    try {
      console.log('Updating MongoDB with:', { email, trackingID, courierCompany });

      //Updating the data --feature -to be worked upon

      // const response = await fetch('/api/updateMongoDB', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, trackingID, courierCompany }), // Send the data
      // });

      // const result = await response.json();

      // if (result.success) {
      //   alert('Update successful!');
      // } else {
      //   alert('Update failed: ' + result.message);
      // }


      //alert('Failed to update data.');   // Remove this after making the above feature work
    } catch (error) {
      console.error('Failed to update data:', error);
      alert('Failed to update data.');
    }
  };


  return (
    <div className="incentives-container">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1>Incentives Records</h1>
          <p>Total Records: {data.length}</p>
          <IncentiveTable
            data={data}
            isAdmin={isAdmin}
            handleUpdate={handleUpdate}
          />
        </>
      )}
    </div>
  );
}
