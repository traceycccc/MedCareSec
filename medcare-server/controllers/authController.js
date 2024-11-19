// import axios from "axios"; // Import axios
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import auth from "../models/auth.js";
// import token from "../models/token.js";
// import rateLimit from "express-rate-limit";


// const saltRounds = 10;
// const { ACCESS_SECRET, REFRESH_SECRET, RECAPTCHA_SECRET_KEY } = process.env;

// // ---------------------> SignUp <-------------------------------

// const signup = async (req, res) => {
//   try {
//     const foundEmail = await auth.findOne({ email: req.body.email });

//     if (foundEmail) {
//       return res.status(400).json({
//         error: true,
//         errorMsg: "That email is already registered!",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

//     await auth.create({
//       ...req.body,
//       password: hashedPassword,
//     });

//     return res.status(201).json({ error: false, msg: "Signup Successful!" });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ error: true, errorMsg: "Internal Server Error!" });
//   }
// };



// const signin = async (req, res) => {
//   try {
//     const { email, password, captchaToken } = req.body;

//     // Log the received captchaToken
//     console.log("Received captchaToken:", captchaToken);

//     // Step 1: Verify reCAPTCHA token with Google
//     const captchaVerification = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
//       params: {
//         secret: RECAPTCHA_SECRET_KEY,
//         response: captchaToken,
//       },
//     });

//     // Step 2.1: Log the entire response from Google to check for verification errors
//     console.log("Captcha Verification Response:", captchaVerification.data);

//     if (!captchaVerification.data.success) {
//       return res.status(400).json({ error: true, errorMsg: "Captcha verification failed. Please try again." });
//     }

//     // Step 2: Proceed with email and password authentication
//     const foundUser = await auth.findOne({ email });

//     if (!foundUser) {
//       return res.status(404).json({ error: true, errorMsg: "Email not registered." });
//     }

//     if (!foundUser.verified) {
//       return res.status(400).json({
//         error: true,
//         errorMsg: "This email is not verified by the Admin. Please login after the verification process is completed.",
//       });
//     }

//     const result = await bcrypt.compare(password, foundUser.password);

//     if (result) {
//       const accessToken = await foundUser.createAccessToken(foundUser);
//       const refreshToken = await foundUser.createRefreshToken(foundUser);
//       return res.status(201).json({
//         error: false,
//         userType: foundUser.userType,
//         accessToken,
//         refreshToken,
//       });
//     } else {
//       return res.status(400).json({ error: true, errorMsg: "Incorrect Password!" });
//     }
//   } catch (error) {
//     console.error("Error during sign-in:", error); // Log full error for debugging
//     return res.status(500).json({ error: true, errorMsg: "Internal Server Error!" });
//   }
// };



// // Define rate limiter for sign-in route
// const signInLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 50, // Limit each IP to 5 requests per windowMs
//   message: {
//     error: true,
//     errorMsg: "Too many login attempts from this IP, please try again after 10 minutes.",
//   },
// });
// // ---------------------> Refresh Token <-------------------------------


// const generateRefreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res
//         .status(403)
//         .json({ error: true, errorMsg: "Access denied, token missing!" });
//     }

//     const storedToken = await token.findOne({ token: refreshToken });

//     if (!storedToken) {
//       return res.status(401).json({ error: true, errorMsg: "Token Expired!" });
//     }

//     const payload = jwt.verify(storedToken.token, REFRESH_SECRET);
//     const accessToken = jwt.sign(payload, ACCESS_SECRET);

//     return res.status(200).json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ error: true, errorMsg: "Internal Server Error!" });
//   }
// };

// // ---------------------> LogOut <-------------------------------

// const logout = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     await token.findOneAndDelete({ token: refreshToken });
//     return res
//       .status(200)
//       .json({ error: false, msg: "Logged Out successfully!" });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ error: true, errorMsg: "Internal Server Error!" });
//   }
// };

// // Exports

// export { signup, signin, generateRefreshToken, logout, signInLimiter };




import axios from "axios"; // Import axios
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../models/auth.js";
import token from "../models/token.js";
import rateLimit from "express-rate-limit";
//add otp stuff
import otpModel from "../models/otp.js";
import crypto from "crypto";
import nodemailer from "nodemailer";


const saltRounds = 10;
const { ACCESS_SECRET, REFRESH_SECRET, RECAPTCHA_SECRET_KEY,  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;


// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});



// ---------------------> Send OTP <-------------------------------

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    // Generate a 5-digit OTP
    const otp = crypto.randomInt(10000, 99999).toString();

    // Send OTP email
    await transporter.sendMail({
      from: `"MedCare Support" <${SMTP_USER}>`,
      to: email,
      subject: "Your MedCare OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    // Store OTP in the database with a timestamp
    await otpModel.create({ email, otp, createdAt: Date.now() });

    return res.status(200).json({ error: false, msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: true, errorMsg: "Failed to send OTP" });
  }
};

// ---------------------> SignUp <-------------------------------

// const signup = async (req, res) => {
//   try {
//     const foundEmail = await auth.findOne({ email: req.body.email });

//     if (foundEmail) {
//       return res.status(400).json({
//         error: true,
//         errorMsg: "That email is already registered!",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

//     await auth.create({
//       ...req.body,
//       password: hashedPassword,
//     });

//     return res.status(201).json({ error: false, msg: "Signup Successful!" });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ error: true, errorMsg: "Internal Server Error!" });
//   }
// };


const signup = async (req, res) => {
  const { email, otp, password, fname, lname, department, speciality, userType } = req.body;

  try {
    // Check if OTP is valid
    const validOtp = await otpModel.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ error: true, errorMsg: "Invalid or expired OTP." });
    }

    // Check if email is already registered
    const foundEmail = await auth.findOne({ email });
    if (foundEmail) {
      return res.status(400).json({ error: true, errorMsg: "That email is already registered!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    await auth.create({
      email,
      password: hashedPassword,
      fname,
      lname,
      department,
      speciality,
      userType,
    });

    // Clean up the OTP after successful registration
    await otpModel.deleteOne({ email });

    return res.status(201).json({ error: false, msg: "Signup Successful!" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ---------------------> SignIn <-------------------------------

const signin = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Log the received captchaToken
    console.log("Received captchaToken:", captchaToken);

    // Step 1: Verify reCAPTCHA token with Google
    const captchaVerification = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      },
    });

    // Step 2.1: Log the entire response from Google to check for verification errors
    console.log("Captcha Verification Response:", captchaVerification.data);

    if (!captchaVerification.data.success) {
      return res.status(400).json({ error: true, errorMsg: "Captcha verification failed. Please try again." });
    }

    // Step 2: Proceed with email and password authentication
    const foundUser = await auth.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ error: true, errorMsg: "Email not registered." });
    }

    if (!foundUser.verified) {
      return res.status(400).json({
        error: true,
        errorMsg: "This email is not verified by the Admin. Please login after the verification process is completed.",
      });
    }

    const result = await bcrypt.compare(password, foundUser.password);

    if (result) {
      const accessToken = await foundUser.createAccessToken(foundUser);
      const refreshToken = await foundUser.createRefreshToken(foundUser);
      return res.status(201).json({
        error: false,
        userType: foundUser.userType,
        accessToken,
        refreshToken,
      });
    } else {
      return res.status(400).json({ error: true, errorMsg: "Incorrect Password!" });
    }
  } catch (error) {
    console.error("Error during sign-in:", error); // Log full error for debugging
    return res.status(500).json({ error: true, errorMsg: "Internal Server Error!" });
  }
};



// Define rate limiter for sign-in route
const signInLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 5 requests per windowMs
  message: {
    error: true,
    errorMsg: "Too many login attempts from this IP, please try again after 10 minutes.",
  },
});
// ---------------------> Refresh Token <-------------------------------


const generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(403)
        .json({ error: true, errorMsg: "Access denied, token missing!" });
    }

    const storedToken = await token.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(401).json({ error: true, errorMsg: "Token Expired!" });
    }

    const payload = jwt.verify(storedToken.token, REFRESH_SECRET);
    const accessToken = jwt.sign(payload, ACCESS_SECRET);

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ---------------------> LogOut <-------------------------------

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await token.findOneAndDelete({ token: refreshToken });
    return res
      .status(200)
      .json({ error: false, msg: "Logged Out successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// Exports

export { sendOtp, signup, signin, generateRefreshToken, logout, signInLimiter };




