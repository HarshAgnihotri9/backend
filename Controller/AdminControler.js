// const AdminModel = require("../MongoModel/AdminModel");
// const userModel = require("../MongoModel/Usermodel.js");
import AdminModel from "../MongoModel/AdminModel.js";
import userModel from "../MongoModel/Usermodel.js";
// const bcrypt = require("bcrypt");
// const { validateEmail } = require("../utils/validation");
import validateEmail from "../utils/validation.js";
// const jwt = require("jsonwebtoken")
import jwt from "jsonwebtoken";
const AdminDetails = async (req, res) => {
  try {
    const admin = await AdminModel.find({ username: req.username });

    if (!admin) {
      res.status(200).json({
        message: "Admin not Found",
      });
    }

    const users = await userModel.find();

    res.status(200).json({
      message: "Get all users profile details",
      ProfileDetails: users,
    });
  } catch (err) {
    res.status(500).json({ Error: true, Message: err });
  }
};
const signUpAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body.password);

  const { error } = validateEmail(email);
  if (error) {
    // res.status(400).json({ message: "Invalid email address", Error: error });
    res.send("invalid email adress");
  }

  try {
    const existingAdmin = await AdminModel.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User already exists" });
    }

    // bcrypt.hash(password, 10, async (err, hash) => {
    //   if (err) {
    //     res.status(400).json({ message: "Problem in encryption" });
    //   }

    // });
    const result = await AdminModel.create({
      email: email,
      password: hash,
      username: username,
    });
    res.send("Account Creation Done");

    // res.status(201).json({ error: false, message: "Account creation done" });
  } catch (error) {
    res.status(500).json({ Error: true, Message: error });
  }
};

//login user code

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  // console.log(req.body.password);
  try {
    const existingAdmin = await AdminModel.findOne({ username: username });
    if (!existingAdmin) {
      return res.status(400).json({ message: "User not exists" });
    }
    // const existingUser = await userModel.findOne({ username: username });

    const cheackpassword = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    console.log(cheackpassword);

    // if (cheackpassword != password) {
    //   res.status(500).json({ Error: true, Message: error });
    // }

    if (!cheackpassword) {
      return res.status(400).json({ message: "Password Incoorect" });
    }
    const token = jwt.sign(
      { username: existingAdmin.username, id: existingAdmin._id }, //payload
      process.env.ADMIN_SECRET_KEY,
      { expiresIn: "30s" }
    );

    // console.log(user);

    // loggedIn(existingUser.email);
    res
      // .cookie("token", token)
      .status(200)
      .json({ message: "Logged in sucessfully", token: token, error: false });
  } catch (error) {
    res.status(500).json({ Error: true, Message: error });
  }
};

// module.exports = { AdminDetails, signUpAdmin, loginAdmin };

const Aadmin = { AdminDetails, signUpAdmin, loginAdmin };
export default Aadmin;
