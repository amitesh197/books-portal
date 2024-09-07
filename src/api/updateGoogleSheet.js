// src/api/updateGoogleSheet.js
export const updateGoogleSheetData = async (row, trackingId, courierCompany) => {
    const endpoint = 'https://script.google.com/macros/s/AKfycbwrWboiglVvb0qLQq988qiQsU6vzkfB0lU4441m1vkUKAPOFwQnhywaLvzEBAOc5NvZ/exec'; // Replace with your Apps Script Web App URL
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          row: row,
          trackingId: trackingId,
          courierCompany: courierCompany
        }),
      });
  
      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to update Google Sheet:', error);
        throw new Error('Failed to update Google Sheet');
      }
  
      return response.text();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  