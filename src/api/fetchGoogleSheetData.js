import axios from 'axios';

export async function fetchGoogleSheetData() {
  const API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1ya4OZ2kpP8QJIWEdD3ZM1oetIj9jriHpxuQOgaDRbX8/values/Sheet1?key=AIzaSyAAe2T-LDq9O-74KILyOMVFHZMzgkUM7Wg';

  try {
    const response = await axios.get(API_URL);
    const rows = response.data.values || [];

    // Check if rows are empty
    if (rows.length === 0) {
      console.warn('No data found in the sheet.');
      return [];
    }

    // Assuming the first row is the header
    const headers = rows[0] || [];
    const dataRows = rows.slice(1);

    // Check if headers are empty
    if (headers.length === 0) {
      console.warn('No headers found in the sheet.');
      return [];
    }

    // Filter out rows where Column A (first column) is empty
    const filteredDataRows = dataRows.filter(row => row[0] && row[0].trim() !== '');

    // Format the filtered data into an array of objects
    const formattedData = filteredDataRows.map((row, index) => {
      let dataObject = {};
      headers.forEach((header, i) => {
        dataObject[header] = row[i] || '';
      });
      dataObject.key = index; // Add a key for React rendering
      return dataObject;
    });

    // Reverse the order to show the latest row first
    console.log('Formatted Data:', formattedData);
    return formattedData.reverse();
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}
