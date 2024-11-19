import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import CryptoJS from "crypto-js";

const encryptionKey = "s3cur3Pa$$w0rdEncryp7ionK3y123456"; // Ensure this matches the backend

// Utility function to decrypt data
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return encryptedData; // Return original if decryption fails
  }
};

export default function AppointmentCard(props) {
  const decryptedPatName = decryptData(props.appointment.patname);
  const decryptedDate = decryptData(props.appointment.date);

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography
          sx={{ fontSize: "0.8rem" }}
          color="text.secondary"
          gutterBottom
        >
          Your Appointment with Patient
        </Typography>
        <Typography sx={{ mb: 2 }} variant="h6" component="div">
          {decryptedPatName}
        </Typography>
        <Typography sx={{ fontSize: "1rem" }} color="text.secondary">
          {decryptedDate}
        </Typography>
        <br />
      </CardContent>
    </Card>
  );
}
