// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
// const dotenv = require("dotenv");
import dotenv from "dotenv";
// const userModel = require("../MongoModel/Usermodel");
// import userModel from '../MongoModel/Usermodel.js'
dotenv.config();
const adminSecret = process.env.ADMIN_SECRET_KEY;

const Adminauth = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, adminSecret);
      req.username = user.username;
      //   req.token = token;
    } else {
      res.status(401).json({ message: "Unauthorized Admin" });
      // res.redirect('/login')
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: true, message: "Unauthorizedd Admin" });
  }
};

// module.exports = { Adminauth };
export default Adminauth;
