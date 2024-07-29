// const mongoose = require("mongoose");
import mongoose from "mongoose";
const schema = mongoose.Schema;

// const { AES } = require("../utils/AES.js");
// const AES = require("../utils/AES.js");
import AES from "../utils/AES.js";

// const { encrypt, decrypt, key } = AES;

const userSchema = new schema(
  {
    email: {
      type: String,
      require: true,
      index: true,
      unique:true
    },
    username: {
      type: String,
      require: true,
      index: true,
    },
    password: {
      type: String,
      require: true,
      set: AES.encrypt,
      get: AES.decrypt,
    },
    IsLoggedIn: {
      default: false,
      type: Boolean,
    },
    otp: { type: String }
  },
  { timestamps: true }
);

const User = mongoose.model("Usersss", userSchema);

// module.exports = User;
export default User;
