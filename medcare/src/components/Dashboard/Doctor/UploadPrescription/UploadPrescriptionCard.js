import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FileUploader from "../../../FileUploader/FileUploader";
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

export default function UploadPrescriptionCard(props) {
  const decryptedPatName = decryptData(props.appointment.patname);
  const decryptedDate = decryptData(props.appointment.date);

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Prescription to
        </Typography>
        <Typography variant="h5" component="div">
          {decryptedPatName}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          {`appointment on: ${decryptedDate}`}
        </Typography>
        <br /> <br />
        <FileUploader appointment={props.appointment} useKey={props.useKey} />
      </CardContent>
    </Card>
  );
}