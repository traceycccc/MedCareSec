import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import FileDownload from "@mui/icons-material/FileDownload";
import CryptoJS from "crypto-js";

const encryptionKey = "s3cur3Pa$$w0rdEncryp7ionK3y123456"; // Ensure this matches the backend

// Utility function to decrypt text data
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return encryptedData; // Return original if decryption fails
  }
};

// Function to handle file decryption and download with ArrayBuffer conversion
const handleDownload = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    // Fetch the file as text since it was encrypted as text
    const encryptedData = await response.text();

    // Decrypt binary data from encrypted text
    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedString = decrypted.toString(CryptoJS.enc.Latin1); // Use Latin1 to retain binary format

    // Convert decrypted string back to binary format
    const byteArray = new Uint8Array(decryptedString.length);
    for (let i = 0; i < decryptedString.length; i++) {
      byteArray[i] = decryptedString.charCodeAt(i);
    }

    // Create a Blob for the decrypted data
    const decryptedBlob = new Blob([byteArray], { type: "application/pdf" });

    // Create a download link for the decrypted file
    const url = URL.createObjectURL(decryptedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prescription.pdf"; // Adjust file name as necessary
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error decrypting or downloading the file:", error);
  }
};

export default function PrescriptionCard(props) {
  const decryptedDocName = decryptData(props.prescription.docname);
  const decryptedDate = decryptData(props.prescription.date);
  const decryptedPDate = decryptData(props.prescription.pdate);

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Prescription By
        </Typography>
        <Typography variant="h5" component="div">
          {decryptedDocName}
        </Typography>
        <Typography
          sx={{ mb: 1.5 }}
          variant="caption"
          color="text.secondary"
          component="div"
        >
          {`appointment on: ${decryptedDate}`}
        </Typography>
        <Typography variant="caption" color="#96B6C5" component="div">
          {`prescribed on: ${decryptedPDate}`}
        </Typography>
        <br /> <br />
        <Fab
          onClick={() => handleDownload(props.prescription.file)}
          color="primary"
          variant="extended"
        >
          <FileDownload /> {"Download Prescription"}
        </Fab>
      </CardContent>
    </Card>
  );
}