import axios from 'axios';

export async function fetchGoogleSheetData() {
  const API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1B7EwUZOPWCM3c8efLvOpqFs_sHVdqjzmY7N8mXJzPXU/values/Sheet1?key=AIzaSyAAe2T-LDq9O-74KILyOMVFHZMzgkUM7Wg';

  try {
    const response = await axios.get(API_URL);
    const rows = response.data.values || [];

    // Assuming the first row is the header
    const headers = rows[0] || [];
    const dataRows = rows.slice(1);

    // Format the data into an array of objects
    const formattedData = dataRows.map((row, index) => {
      let dataObject = {};
      headers.forEach((header, i) => {
        dataObject[header] = row[i] || '';
      });
      dataObject.key = index; // Add a key for React rendering
      return dataObject;
    });

    // Reverse the order to show the latest row first
    return formattedData.reverse();
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}
