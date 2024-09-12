import mongoose from 'mongoose';

const IncentiveSchema = new mongoose.Schema({
  email: { type: String, required: true },
  TrackingID: { type: String },
  CourierCompany: { type: String },
  // Add other fields as necessary
});

const Incentive = mongoose.models.Incentive || mongoose.model('Incentive', IncentiveSchema);

export { Incentive };
