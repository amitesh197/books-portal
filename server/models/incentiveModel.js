import mongoose from 'mongoose';

console.log("In server->models->incentiveModel.js file");

const IncentiveSchema = new mongoose.Schema({
  email: { type: String, required: true },
  TrackingID: { type: String },
  CourierCompany: { type: String },
  // Add other fields as necessary
});

console.log("IncentiveSchema = ", IncentiveSchema);

const Incentive = mongoose.models.Incentive || mongoose.model('Incentive', IncentiveSchema);

console.log("Incentive = ", Incentive);

export { Incentive };
