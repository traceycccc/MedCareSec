

// import React, { useState } from "react";
// import { Box, Avatar, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import api from "../../api";
// import { useAuth } from "../../AuthContext";
// import ReCAPTCHA from "react-google-recaptcha";
// import styles from "./SignIn.module.css";

// const RECAPTCHA_SITE_KEY = "YOUR_RECAPTCHA_SITE_KEY";

// export default function SignIn() {
//   const { setUserType, setLoader, setAlert, setAlertMsg } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({}); // New errors state
//   const [showPassword, setShowPassword] = useState(false); // Visibility toggle for password
//   const [captchaToken, setCaptchaToken] = useState(null); // Store reCAPTCHA token

//   // Validation function
//   const validateFields = () => {
//     const newErrors = {};

//     // Email validation (regex for email format)
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email.trim()) {
//       newErrors.email = "Email is required.";
//     } else if (!emailRegex.test(email)) {
//       newErrors.email = "Enter a valid email address.";
//     }

//     // Password validation
//     if (!password.trim()) {
//       newErrors.password = "Password is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if no errors
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!validateFields()) {
//       return; // Stop submission if validation fails
//     }

//     const postData = { email, password };

//     try {
//       setLoader(true);
//       const res = await api.signin(postData);

//       if (res.data.error) {
//         setLoader(false);
//         setPassword("");
//         setAlertMsg(res.data.errorMsg);
//         setAlert(true);
//       } else {
//         setLoader(false);
//         setEmail("");
//         setPassword("");
//         const loggedUser = res.data.userType;
//         const { accessToken, refreshToken } = res.data;
//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("refreshToken", refreshToken);
//         setUserType(loggedUser);
//       }
//     } catch (error) {
//       setLoader(false);
//       setPassword("");
//       setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
//       setAlert(true);
//       console.error(error);
//     }
//   };

//   // Toggle Password Visibility
//   const handleClickShowPassword = () => {
//     setShowPassword((show) => !show);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.col1}>
//         <Box
//           component="form"
//           className={styles.form}
//           validate="true"
//           onSubmit={handleSubmit}
//         >
//           <Avatar
//             alt="auth logo"
//             src="/authimg.png"
//             sx={{ width: 100, height: 100 }}
//           />
//           <Typography component="h1" variant="h5">
//             Sign in
//           </Typography>

//           {/* Email Field */}
//           <TextField
//             margin="normal"
//             fullWidth
//             id="email"
//             type="email"
//             label="Email Address"
//             name="email"
//             value={email}
//             autoComplete="email"
//             autoFocus
//             onChange={(event) => setEmail(event.target.value)}
//             error={Boolean(errors.email)} // Display error state
//             helperText={errors.email} // Show error message
//           />

//           {/* Password Field with Visibility Toggle */}
//           <TextField
//             margin="normal"
//             fullWidth
//             name="password"
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             id="password"
//             value={password}
//             onChange={(event) => setPassword(event.target.value)}
//             error={Boolean(errors.password)} // Display error state
//             helperText={errors.password} // Show error message
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleClickShowPassword} edge="end">
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign In
//           </Button>

//           <Link to="/signup" className={styles.linkBtn}>
//             {"Don't have an account? Sign Up"}
//           </Link>
//         </Box>
//       </div>
//       <div className={styles.col2}>
//         <img src="/medicine.svg" alt="doctor" draggable="false" />
//       </div>
//     </div>
//   );
// }




// import React, { useState } from "react";
// import { Box, Avatar, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import api from "../../api";
// import { useAuth } from "../../AuthContext";
// import ReCAPTCHA from "react-google-recaptcha";
// import styles from "./SignIn.module.css";

// const RECAPTCHA_SITE_KEY = "6LcFwX0qAAAAAF6BglW35fZQ_jM0MWRcfs4NLPcl"; // Replace with your actual site key

// export default function SignIn() {
//   const { setUserType, setLoader, setAlert, setAlertMsg } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [captchaToken, setCaptchaToken] = useState(null); // Store reCAPTCHA token

//   const validateFields = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email.trim()) newErrors.email = "Email is required.";
//     else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address.";
//     if (!password.trim()) newErrors.password = "Password is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!validateFields() || !captchaToken) return;

//     const postData = { email, password, captchaToken }; // Include captchaToken
//     try {
//       setLoader(true);
//       const res = await api.signin(postData);

//       if (res.data.error) {
//         setLoader(false);
//         setPassword("");
//         setAlertMsg(res.data.errorMsg);
//         setAlert(true);
//       } else {
//         setLoader(false);
//         setEmail("");
//         setPassword("");
//         setUserType(res.data.userType);
//         localStorage.setItem("accessToken", res.data.accessToken);
//         localStorage.setItem("refreshToken", res.data.refreshToken);
//       }
//     } catch (error) {
//       setLoader(false);
//       setPassword("");
//       setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
//       setAlert(true);
//     }
//   };

//   const handleCaptchaChange = (token) => {
//     setCaptchaToken(token); // Set the reCAPTCHA token on change
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword((show) => !show);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.col1}>
//         <Box
//           component="form"
//           className={styles.form}
//           validate="true"
//           onSubmit={handleSubmit}
//         >
//           <Avatar alt="auth logo" src="/authimg.png" sx={{ width: 100, height: 100 }} />
//           <Typography component="h1" variant="h5">Sign in</Typography>

//           <TextField
//             margin="normal"
//             // required
//             fullWidth
//             id="email"
//             type="email"
//             label="Email Address"
//             name="email"
//             value={email}
//             autoComplete="email"
//             autoFocus
//             onChange={(event) => setEmail(event.target.value)}
//             error={Boolean(errors.email)}
//             helperText={errors.email}
//           />

//           <TextField
//             margin="normal"
//             // required
//             fullWidth
//             name="password"
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             id="password"
//             value={password}
//             onChange={(event) => setPassword(event.target.value)}
//             error={Boolean(errors.password)}
//             helperText={errors.password}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={handleClickShowPassword} edge="end">
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {/* reCAPTCHA Component */}
//           <ReCAPTCHA
//             sitekey={RECAPTCHA_SITE_KEY}
//             onChange={handleCaptchaChange}
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign In
//           </Button>

//           <Link to="/signup" className={styles.linkBtn}>
//             {"Don't have an account? Sign Up"}
//           </Link>
//         </Box>
//       </div>
//       <div className={styles.col2}>
//         <img src="/medicine.svg" alt="doctor" draggable="false" />
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Box, Avatar, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./SignIn.module.css";

const RECAPTCHA_SITE_KEY = "6LcFwX0qAAAAAF6BglW35fZQ_jM0MWRcfs4NLPcl"; // Replace with your actual site key

export default function SignIn() {
  const { setUserType, setLoader, setAlert, setAlertMsg } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState(""); // New state for reCAPTCHA error

  const validateFields = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email address.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCaptchaError(""); // Reset captcha error on submit

    if (!validateFields()) return;
    if (!captchaToken) {
      setCaptchaError("Please complete the reCAPTCHA verification."); // Set captcha error if token is missing
      return;
    }

    const postData = { email, password, captchaToken };
    try {
      setLoader(true);
      const res = await api.signin(postData);

      if (res.data.error) {
        setLoader(false);
        setPassword("");
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setLoader(false);
        setEmail("");
        setPassword("");
        setUserType(res.data.userType);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
    } catch (error) {
      setLoader(false);
      setPassword("");
      setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
      setAlert(true);
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError(""); // Clear the captcha error when it’s successfully completed
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <div className={styles.container}>
      <div className={styles.col1}>
        <Box
          component="form"
          className={styles.form}
          validate="true"
          onSubmit={handleSubmit}
        >
          <Avatar alt="auth logo" src="/authimg.png" sx={{ width: 100, height: 100 }} />
          <Typography component="h1" variant="h5">Sign in</Typography>

          <TextField
            margin="normal"
            fullWidth
            id="email"
            type="email"
            label="Email Address"
            name="email"
            value={email}
            autoComplete="email"
            autoFocus
            onChange={(event) => setEmail(event.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* reCAPTCHA Component */}
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />
          {/* Display reCAPTCHA error message if needed */}
          {captchaError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {captchaError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Link to="/signup" className={styles.linkBtn}>
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </div>
      <div className={styles.col2}>
        <img src="/medicine.svg" alt="doctor" draggable="false" />
      </div>
    </div>
  );
}
