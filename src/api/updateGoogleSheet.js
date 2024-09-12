export const updateGoogleSheetData = async ({ rowIndex, trackingID, courierCompany }) => {
  const url = 'https://script.google.com/macros/s/AKfycbxBgPQQSuCRuoitvl6jBFXuKcWKJlNqr-gN-N0zqTc/dev';  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        rowIndex,
        trackingID,
        courierCompany,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.status === 'success') {
      console.log('Data successfully updated');
    } else {
      console.error('Failed to update data');
    }
  } catch (error) {
    console.error('Error updating Google Sheets:', error);
  }
};
