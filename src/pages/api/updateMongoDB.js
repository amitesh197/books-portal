// api/updateMongoDB.js
export async function updateMongoDB(email, trackingID, courierCompany) {
    console.log("From pages->api->updateMongoDB.js: ", email, trackingID, courierCompany);
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, trackingID, courierCompany }),
    });
  
    if (!response.ok) {
      throw new Error(`Error updating MongoDB: ${response.statusText}`);
    }
  
    return response.json();
  }
  