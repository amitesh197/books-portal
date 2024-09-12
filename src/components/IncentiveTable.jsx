import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/query_table/IncentiveTable.scss';

const IncentiveTable = ({ data, handleUpdate, isAdmin }) => {
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    setLocalData(data); // Update local data when prop data changes
  }, [data]);

  const handleInputChange = (rowIndex, field, value) => {
    const updatedData = [...localData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    setLocalData(updatedData);
  };

  const handleBlur = (rowIndex) => {
    const row = localData[rowIndex];
    if (isAdmin) {
      handleUpdate(row.email, row.TrackingID, row.CourierCompany);
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="header-row">
            <th>Tracking ID</th>
            <th>Courier Company</th>
            <th>Course Name</th>
            <th>Student Name</th>
            <th>Student Mobile Number</th>
            <th>Date of Purchase</th>
            <th>Shipment Address</th>
          </tr>
        </thead>
        <tbody>
          {localData.map((row, rowIndex) => (
            <tr key={rowIndex} className="data-row">
              <td>
                {isAdmin ? (
                  <input
                    type="text"
                    value={''}

                    //update this feature to make it work properly

                    // value={row.TrackingID || ''}
                    // onChange={(e) => handleInputChange(rowIndex, 'TrackingID', e.target.value)}
                    // onBlur={() => handleBlur(rowIndex)}
                  />
                ) : (
                  row.TrackingID || 'N/A' // Handle empty values
                )}
              </td>
              <td>
                {isAdmin ? (
                  <input
                    type="text"
                    value={''}


                    //update this feature to make it work properly

                    //value={row.CourierCompany || ''}
                    //onChange={(e) => handleInputChange(rowIndex, 'CourierCompany', e.target.value)}
                    //onBlur={() => handleBlur(rowIndex)}
                  />
                ) : (
                  row.CourierCompany || 'N/A' // Handle empty values
                )}
              </td>
              <td>{row.CourseName}</td>
              <td>{row.name || 'N/A'}</td> 
              <td>{row.mobile || 'N/A'}</td> 
              <td>{row.TransDate || 'N/A'}</td> 
              <td>{row.ShipmentAdreess || 'N/A'}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

IncentiveTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleUpdate: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default IncentiveTable;
