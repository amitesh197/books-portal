import express from 'express';
import mongoose from 'mongoose';
import { Incentive } from '../models/incentiveModel.js'; // Adjusted path

const router = express.Router();

const MONGO_URI = 'mongodb+srv://amiteshs197:AmItEsH123@cluster0.mlmod.mongodb.net/sarrthi_books?retryWrites=true&w=majority';

console.log("In server->routes->data.js file");
// Ensure a stable MongoDB connection
async function connectMongo() {
  console.log("connectmongo function initialized");
    if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  console.log("connectmongo function completed");
}

router.post('/', async (req, res) => {
    console.log("Post '/' initialized");
  await connectMongo();

  const { email, trackingID, courierCompany } = req.body;

  try {
    const result = await Incentive.findOneAndUpdate(
      { email },
      { TrackingID: trackingID, CourierCompany: courierCompany },
      { new: true, upsert: true }
    );
    console.log("Result: ", result);
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(404).json({ success: false, message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
  console.log("Post '/' completed");
});

export default router;
