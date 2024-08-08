// models/Tenant.js
import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  pgNo: { type: String, required: true },
  phoneNo: { type: String, required: true },
  aadhaarNo: { type: String, required: true },
  roomNo: { type: String, required: true },
  totalRent: { type: String, required: true },
  place: { type: String, required: true },
});

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
