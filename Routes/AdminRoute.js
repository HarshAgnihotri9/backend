// const express = require("express");
import express from "express";

// const { Adminauth } = require("../middleware/adminAuth");
import Adminauth from "../middleware/adminAuth.js";

// const {
//   AdminDetails,
//   signUpAdmin,
//   loginAdmin,
// } = require("../Controller/AdminControler");

import Aadmin from "../Controller/AdminControler.js";
const { AdminDetails, signUpAdmin, loginAdmin } = Aadmin;

const adminRouter = express.Router();

adminRouter.post("/signup", signUpAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/userDetail", Adminauth, AdminDetails);

// module.exports = adminRouter;
export default adminRouter;
