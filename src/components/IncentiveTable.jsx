import React from 'react';
import '../stylesheets/query_table/IncentiveTable.scss';

const IncentiveTable = ({ data, columns, onRowClick }) => {
  return (
    <div className="table-container">
      <table className="table">
        {/* Header Row */}
        <thead>
          <tr className="header-row">
            {columns.map((column) => (
              <th key={column.header} className="header-cell">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Data Rows */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick(row)}
              className="data-row"
            >
              {columns.map((column) => (
                <td key={column.accessor} className="data-cell">
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncentiveTable;