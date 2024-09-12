import { MongoClient } from 'mongodb';
import axios from 'axios';

// MongoDB Configuration
const MONGO_URI = 'mongodb+srv://amiteshs197:AmItEsH123@cluster0.mlmod.mongodb.net/sarrthi_books?retryWrites=true&w=majority';
const DATABASE_NAME = 'sarrthi_books';
const COLLECTION_NAME = 'Cluster0';

// Fetch Data from MongoDB
async function fetchDataFromMongoDB() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const data = await collection.find().toArray();
    return data;
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error.message);
    return [];
  } finally {
    await client.close();
  }
}

// Update Data in MongoDB
async function updateMongoDB(email, trackingID, courierCompany) {
    
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    console.log('Sending update request to /api/data with:', { email, trackingID, courierCompany });
    const result = await collection.updateOne(
        
      { email },
      { $set: { TrackingID: trackingID, CourierCompany: courierCompany } },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error('Error updating MongoDB:', error.message);
    throw error;
  } finally {
    await client.close();
  }
}

// Fetch Data from Google Sheets
// async function fetchGoogleSheetData() {
//   const API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1B7EwUZOPWCM3c8efLvOpqFs_sHVdqjzmY7N8mXJzPXU/values/Sheet1?key=AIzaSyAAe2T-LDq9O-74KILyOMVFHZMzgkUM7Wg';
//   try {
//     const response = await axios.get(API_URL);
//     const rows = response.data.values || [];

//     // Assuming the first row is the header
//     const headers = rows[0] || [];
//     const dataRows = rows.slice(1);

//     // Format the data into an array of objects
//     const formattedData = dataRows.map((row, index) => {
//       let dataObject = {};
//       headers.forEach((header, i) => {
//         dataObject[header] = row[i] || '';
//       });
//       dataObject.key = index; // Add a key for React rendering
//       return dataObject;
//     });

//     // Reverse the order to show the latest row first
//     return formattedData.reverse();
//   } catch (error) {
//     console.error('Error fetching data from Google Sheets:', error);
//     return [];
//   }
// }

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, trackingID, courierCompany } = req.body;
    try {
      await updateMongoDB(email, trackingID, courierCompany);
      res.status(200).json({ message: 'Update successful!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update data.' });
    }
  } else {
    const data = await fetchDataFromMongoDB();
    res.status(200).json(data);
  }
}
