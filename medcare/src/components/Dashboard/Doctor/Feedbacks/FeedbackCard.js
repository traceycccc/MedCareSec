import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
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

export default function FeedbackCard(props) {
  const decryptedDate = props.feedback?.date ? decryptData(props.feedback.date) : props.feedback.date;
  const decryptedPatname = props.feedback?.patname ? decryptData(props.feedback.patname) : props.feedback.patname;

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography sx={{ mb: 2.5 }} variant="h5" component="div">
          {props.feedback.review}
        </Typography>
        <Typography sx={{ mb: 1.5, fontSize: 14 }} color="#96B6C5" gutterBottom>
          {`appointment date: ${decryptedDate}`}
        </Typography>
        <Typography
          sx={{ mb: 1.5, fontSize: 14 }}
          color="text.secondary"
          gutterBottom
        >
          {decryptedPatname}
        </Typography>
        <Rating name="read-only" value={props.feedback.rating} readOnly />
        <br />
      </CardContent>
    </Card>
  );
}
