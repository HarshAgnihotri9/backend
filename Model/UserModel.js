"use strict";

import userModel from "../Schema/User.js";
import userKeys from "../Schema/keys.js";
import jwtModel from "../Schema/jwt.js";
import validation from "../utills/validationSchema.js";
import logout_validation from "../utills/logout_Validation.js";
import AES from "../utills/AES.js";
import Keyvalidation from "../utills/keysValidation.js";
import jwt from "jsonwebtoken";
import mailAlerts from "../mail/mailAlert.js";

const { wrongAlert, loggedIn, signupAlert, lockerRequest } = mailAlerts;
const { encrypt, decrypt } = AES;

const signUpUser = async (body) => {
  const { username, email, password, key1, key2, key3, key4, key5 } = body;

  try {
    //Validate for Email and Password
    const { error, msg = "" } = validation(email, password);
    if (error) return { error: true, message: msg };

    //create a new user in the database users
    const result = await userModel.create({
      email: email,
      password: password,
      username: username,
    });

    //Validating keys => all keys should be Unique
    const { error: err, msg: kmsg = "" } = Keyvalidation([
      key1,
      key2,
      key3,
      key4,
      key5,
    ]);
    if (err) {
      //if any error in keys validation so it will delete the created user from the database
      await userModel.findByIdAndRemove(result.id);
      return { error: true, message: kmsg };
    }

    //storing the keys in the seprate database Keys
    const keys = await userKeys.create({
      userId: result.id,
      key1: encrypt(key1),
      key2: encrypt(key2),
      key3: encrypt(key3),
      key4: encrypt(key4),
      key5: encrypt(key5),
    });

    //Send the Signup Alert On mail from the bank
    signupAlert(email);
    return { error: false, message: "Account created sucessfully" };
  } catch (error) {
    return { Error: true, Message: error.message };
  }
};

const logInUser = async (body) => {
  const { email, password } = body;

  try {
    //Validation for Email and Password
    const { error, msg = "" } = validation(email, password);
    if (error) return { error: true, message: msg };

    //checking if user exixting or not
    const existingUser = await userModel.findOne({ email });
    console.log(existingUser);
    if (!existingUser) {
      return { error: true, message: "User not found" };
    }

    //if wrong password then send the wrong password mail alert to the user
    if (existingUser.password != password) {
      wrongAlert(email);
      return { error: true, message: "Invalid Credentials" };
    }

    //if password is correct then creating a token with the help of JWT
    const token = jwt.sign(
      { email, id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    //store token in JWT model for Logout reference
    await jwtModel.create({
      jwt: token,
    });

    //Sending login alert to the user
    loggedIn(email);

    //user Loggedin Now
    return { message: "Logged in sucessfully", token: token, error: false };
  } catch (error) {
    return { Error: "true", Message: error.message };
  }
};

//User can only see his own data after user signin token authentication
const profileDetails = async (token, email) => {
  try {
    const { Error = "", loggedOut } = await logout_validation(token);
    if (Error) return { error: true, Msg: Error };

    if (loggedOut) return { error: true, Message: "User has been loggedOut" };

    //Finding user with the help of email that is return by middleware useAuth
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return { Message: "User Not Exist" };
    }

    return { error: false, Profile: user };
  } catch (err) {
    return { Error: true, ErrorMessage: err.message };
  }
};

//For JMeter Testing and Admin
//Admin have capability to see all the user Details aften Admin signin token authentication
const Details = async () => {
  try {
    const details = await userModel.find({});
    if (!details) return { error: true, Message: "No Records Found" };

    return { error: false, data: details };
  } catch (err) {
    return { error: true, Message: err.message };
  }
};

// User can send request to the Admin for Locker Creation
const SendRequest = async (body) => {
  const data = { userEmail: req.email, Requ: req.body.Requ };

  userModel.find({ email: req.email }, (err, docs) => {
    if (!err) {
      //Using Fetch request will store in the Admin database
      fetch("http://localhost:3002/admin/requests", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).catch((error) => {
        console.error("Error:", error);
      });

      //sending email to user and admin
      lockerRequest(req.email);
      res.status(200).json({
        error: false,
        message: "Request has been sent to Admin for New Locker",
      });
    } else {
      res.send(err);
    }
  });
};

const ResetPassword = async (query, body) => {
  const { email, key1, key2, key3, key4, key5 } = query;
  const { newPassword } = body;

  //Validating Email and Password
  try {
    const { error, msg = "" } = validation(email, newPassword);
    if (error) return { error: true, message: msg };

    //Validating Keys, all should be unique
    const { error: err, msg: kmsg = "" } = Keyvalidation([
      key1,
      key2,
      key3,
      key4,
      key5,
    ]);
    if (err) {
      return { error: true, message: kmsg };
    }

    //Finding user with Email
    const userD = await userModel.findOne({ email: email });
    if (!userD) return { error: true, Message: "No User Found" };

    const userKey = await userKeys.findOne({ userId: userD.id });
    if (!userKey) return { error: true, Message: "No Keys Found" };

    if (
      key1 == decrypt(userKey.key1) &&
      key2 == decrypt(userKey.key2) &&
      key3 == decrypt(userKey.key3) &&
      key4 == decrypt(userKey.key4) &&
      key5 == decrypt(userKey.key5)
    ) {
      const result = await userModel.updateOne(
        { email: email },
        { $set: { password: newPassword } }
      );
      console.info("result ", result);

      if (result.acknowledged) {
        return { Error: false, message: "Password updated successfully" };
      }
    } else {
      return { Error: true, message: "Keys Mismatch" };
    }
  } catch (error) {
    return { Error: true, Message: error.message };
  }
};

const logout = async (body) => {
  const { jwt } = body;
  const data = await jwtModel.findOne({ jwt: jwt });
  if (!data) return { message: `Needs to be Login first....` };

  await jwtModel.updateOne({ _id: data._id }, { flag: 1 });
  return { message: "Logged-Out" };
};

const UserModels = {
  signUpUser,
  logInUser,
  profileDetails,
  SendRequest,
  Details,
  ResetPassword,
  logout,
};

export default UserModels;
