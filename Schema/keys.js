"use strict";
import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const schema = mongoose.Schema;

const KeyPhares = new schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    key1: {
      type: String,
      required: true,
    },
    key2: {
      type: String,
      required: true,
    },
    key3: {
      type: String,
      required: true,
    },
    key4: {
      type: String,
      required: true,
    },
    key5: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const userKeys = mongoose.model("Keys", KeyPhares);

export default userKeys;
