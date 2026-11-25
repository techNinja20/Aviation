const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { calculateOrder, generateOtp } = require("../utils/utils");
const {
  checkIfIdentityExist,
  insertIntoUserTable,
  insertIntoOtpTable,
  checkIfOtpExist,
} = require("../models/model");
const { mysqlConnection } = require("../config/mysqlConnect");

const createNewUser = async (req, res) => {
  const { firstName, lastName, otherName, email, password, phone } = req.body;

  try {
    const [responseFromDb] = await checkIfIdentityExist("User", "email", email);

    if (responseFromDb.length > 0) {
      throw new Error("User Already exist with this email");
    }

    // Store hash in your password DB
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userId = uuidv4();

    const [results] = await insertIntoUserTable("user", {
      userId,
      firstName,
      lastName,
      otherName,
      email,
      salt,
      hash,
      phone,
    });

    if (results.affectedRows === 0) {
      throw new Error("Unable to insert");
    }

    const otpCode = generateOtp();
    const expiredAt = new Date(Date.now() + 30 * 1000); // OTP expires in 10 minutes

    insertIntoOtpTable("Otp", { otpCode, email, expiredAt });

    // send otp to user's email

    res.status(200).json({
      status: true,
      message: "Otp has been sent your email for verification ",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const verifyUser = async (req, res) => {
  const { email } = req.params;
  const { otp_code } = req.body;

  try {
    const [responseFromDB] = await checkIfOtpExist(email, otp_code);
    console.log("seeeeeee", responseFromDB);



    // const today =  responseFromDB[0].expiredAt
    // console.log("today", typeof today, today)

    if (responseFromDB.length === 0) {
      throw new Error("Invalid Otp code, try again !");
    }


    if (new Date(responseFromDB[0].expiredAt) == new Date()) {
      throw new Error("Otp has expired, request for another !");
    }

    res.status(200).json({
      status: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewUser,
  verifyUser,
};
