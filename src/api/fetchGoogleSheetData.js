import axios from 'axios';

export async function fetchGoogleSheetData() {
  const API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1XJlywkzYDy5qk2SU50fyss011DAlFH0TxLrbzGaorfg/values/Sheet1?key=AIzaSyAvFEjU3k501DncNZH7HvgCrnJHHqT8mZ0';

  try {
    const response = await axios.get(API_URL);
    const rows = response.data.values;

    // Format the data into an array of objects
    const formattedData = rows.map((row, index) => ({
      name: row[0],
      mobile: row[1],
      courseid: row[2],
      courseName: row[3],
      couponCode: row[4],
      TransDate: row[5],
      amount_paid: row[6],
      key: index, // Add a key for React rendering
    }));

    // Reverse the order to show the latest row first
    return formattedData.reverse();
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}
