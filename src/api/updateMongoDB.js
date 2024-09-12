export async function updateMongoDB(email, trackingID, courierCompany) {
  console.log("In src->spi->updateMongoDB.js file");
  try {
    const response = await fetch('http://localhost:3005/api/data', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({ email, trackingID, courierCompany }),
    });
    console.log("updateMongoDB.js fetch initialized, and response = ", response);
    if (!response.ok) {
      throw new Error(`Error updating MongoDB: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error updating MongoDB:', error.message);
    throw error;
  }
}
