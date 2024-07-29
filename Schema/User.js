"strict true";

import mongoose from "mongoose";
import AES from "../utills/AES.js";

// mongoose.set("strictQuery", true);

const schema = mongoose.Schema;

const UserSchema = new schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      set: AES.encrypt,
      get: AES.decrypt,
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("User", UserSchema);

export default userModel;
