"use strict";
import mongoose from "mongoose";

mongoose.set("strictQuery", true);
const jwtSchema = mongoose.Schema(
  {
    jwt: {
      type: String,
    },
    flag: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const jwtModel = mongoose.model("jwt", jwtSchema);

export default jwtModel;
