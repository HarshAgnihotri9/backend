// const { boolean } = require("joi");
// const mongoose = require("mongoose");
import mongoose from "mongoose";
const schema = mongoose.Schema;

const AdminSchema = new schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

// module.exports = Admin;
export default Admin;
