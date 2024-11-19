





import React, { useState } from "react";
import { 
  Box, 
  Avatar, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import SelectInput from "../SelectInput/SelectInput";
import api from "../../api";
import { useAuth } from "../../AuthContext";

const options = ["Patient", "Staff", "Doctor"];
const departments = [
  "All Departments",
  "Cardiology",
  "Dermatology",
  "ENT",
  "Gastroenterology",
  "General Medicine",
  "General Surgery",
  "Neurology",
  "Paediatrics",
  "Urology",
  "Dental",
  "General Physician"
];

export default function SignUp() {
  const { setLoader, setAlert, setAlertMsg, setAlertType } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState("Patient");
  const [department, setDepartment] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Visibility toggle for password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Visibility toggle for confirm password
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckboxError, setIsCheckboxError] = useState(false);
  // Define OTP-related states
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Function to send OTP
  const sendOtp = async () => {
    const isValid = validateFields();
    if (!isValid) return;

    try {
      setLoader(true);
      const res = await api.sendOtp({ email }); // Backend API to send OTP to the user's email
      setLoader(false);

      if (res.data.error) {
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setAlertMsg("OTP sent to your email");
        setAlertType("success");
        setAlert(true);
        setIsOtpSent(true); // Show OTP input field
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg("Error sending OTP");
      setAlert(true);
    }
  };


  // Strong Password Validation Function
  const isStrongPassword = (password) => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  // Validation function
  const validateFields = () => {
    const newErrors = {};

    // First name and Last name validations
    if (!fname.trim()) newErrors.fname = "First name is required.";
    if (!lname.trim()) newErrors.lname = "Last name is required.";

    // Email validation (basic regex for email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password validation (strong password criteria)
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!isStrongPassword(password)) {
      newErrors.password = "Password must be at least 12 characters long and include uppercase and lowercase letters, a number, and a special character.";
    }

    // Confirm Password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Doctor-specific fields validation
    if (user === "Doctor") {
      if (!department.trim()) newErrors.department = "Department is required for doctors.";
      if (!speciality.trim()) newErrors.speciality = "Speciality is required for doctors.";
    }

    // Checkbox validation
    if (!isChecked) {
      setIsCheckboxError(true);
      newErrors.checkbox = "You must agree to the Terms and Conditions and Privacy Policy.";
    } else {
      setIsCheckboxError(false);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    //otp validation
    if (!otp.trim()) {
      setAlertMsg("Enter the OTP sent to your email.");
      setAlert(true);
      return;
    }

    const postData = {
      userType: user,
      fname,
      lname,
      department,
      speciality,
      email,
      password,
      otp, // Send OTP along with other details
    };

    try {
      setLoader(true);
      const res = await api.signup(postData);
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setLoader(false);
        setUser("Patient");
        setDepartment("");
        setSpeciality("");
        setFname("");
        setLname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setAlertMsg(res.data.msg);
        setAlertType("success");
        setAlert(true);

        navigate("/signin");
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error.response?.data?.errorMsg || "An error occurred!");
      setAlert(true);
      console.error(error);
    }
  };

  // Toggle Password Visibility
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // Toggle Confirm Password Visibility
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  return (
    <div className={styles.container}>
      <Box
        component="form"
        className={styles.form}
        validate="true"
        onSubmit={handleSubmit}
      >
        <Avatar
          alt="auth logo"
          src="/authimg.png"
          sx={{ width: 100, height: 100 }}
        />
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        {/* User Type Field */}
        <SelectInput
          label="User Type"
          value={user}
          setValue={setUser}
          options={options}
        />

        {/* Conditional Fields for Doctors */}
        {user === "Doctor" && (
          <>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                value={department}
                label="Department"
                onChange={(event) => setDepartment(event.target.value)}
                error={Boolean(errors.department)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.department && (
              <Typography color="error" variant="body2">
                {errors.department}
              </Typography>
            )}
            <TextField
              name="speciality"
              // required
              fullWidth
              id="speciality"
              label="Speciality"
              sx={{ marginBottom: "10px" }}
              value={speciality}
              onChange={(event) => setSpeciality(event.target.value)}
              error={Boolean(errors.speciality)}
              helperText={errors.speciality}
            />
          </>
        )}

        {/* Name Fields */}
        <Box component="div" className={styles.nameContainer}>
          <TextField
            className={styles.nameInput}
            autoComplete="given-name"
            name="firstName"
            // required
            fullWidth
            id="firstName"
            label="First Name"
            value={fname}
            autoFocus
            onChange={(event) => setFname(event.target.value)}
            error={Boolean(errors.fname)}
            helperText={errors.fname}
          />
          <TextField
            className={styles.nameInput}
            autoComplete="given-name"
            name="LastName"
            // required
            fullWidth
            id="LastName"
            label="Last Name"
            value={lname}
            onChange={(event) => setLname(event.target.value)}
            error={Boolean(errors.lname)}
            helperText={errors.lname}
          />
        </Box>

        {/* Email Field */}
        <TextField
          margin="normal"
          // required
          fullWidth
          id="email"
          type="email"
          label="Email Address"
          name="email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />

        {/* Password Field */}
        <TextField
          margin="normal"
          // required
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

        {/* Confirm Password Field */}
        <TextField
          margin="normal"
          // required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl error={isCheckboxError}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              id="terms"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <Link to="/terms" target="_blank">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" target="_blank">
                Privacy Policy
              </Link>
            </label>
          </div>
          {isCheckboxError && (
            <Typography color="error" variant="body2">
              You must agree to the Terms and Conditions and Privacy Policy.
            </Typography>
          )}
        </FormControl>

        {/* Submit Button */}
        {/* <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button> */}

        {!isOtpSent ? (
          <Button fullWidth variant="contained" onClick={sendOtp} sx={{ mt: 3, mb: 2 }}>
            Send OTP
          </Button>
        ) : (
          <>
            <TextField
              margin="normal"
              fullWidth
              id="otp"
              type="text"
              label="OTP"
              name="otp"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                setOtp(value); // Update OTP value regardless of validation
                // Validate OTP in real-time
                if (!/^\d{5}$/.test(value) && value !== "") {
                  setErrors((prev) => ({
                    ...prev,
                    otp: "OTP must be a 5-digit number.",
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, otp: "" }));
                }
              }}
              error={Boolean(errors.otp)}
              helperText={errors.otp}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
          </>
        )}

        <Link to="/signin" className={styles.linkBtn}>
          {"Already have an account? Sign In"}
        </Link>
      </Box>
    </div>
  );
}
