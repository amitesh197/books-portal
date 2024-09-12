// // pages/api/data.js

import mongoose from 'mongoose';
import { Incentive } from '../../../models/incentiveModel'; // Adjust the path as needed

const MONGO_URI = 'mongodb+srv://amiteshs197:AmItEsH123@cluster0.mlmod.mongodb.net/sarrthi_books?retryWrites=true&w=majority';
console.log("In the src->pages->api->data.js file");
// Ensure a stable MongoDB connection
async function connectMongo() {
  console.log("Trying to connect...");
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  }
}

export default async function handler(req, res) {
  console.log("In the handler file");
  // First, connect to MongoDB
  await connectMongo();

  if (req.method === 'POST') {
    console.log('POST request initiated');
    const { email, trackingID, courierCompany } = req.body;

    try {
      console.log('Attempting to update document in MongoDB');
      const result = await Incentive.findOneAndUpdate(
        { email }, // Find by email
        { TrackingID: trackingID, CourierCompany: courierCompany }, // Update fields
        { new: true, upsert: true } // Return the updated doc & insert if not found
      );

      console.log('Update Result:', result);
      if (result) {
        res.status(200).json({ success: true, data: result });
      } else {
        res.status(404).json({ success: false, message: 'Document not found' });
      }
    } catch (error) {
      console.error('Error during MongoDB operation:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
