import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Fab, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../../api";
import { useAuth } from "../../../../AuthContext";
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
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const [value, setValue] = useState(props.appointment?.rating || 0);
  const [feedbackText, setFeedbackText] = useState(
    props.appointment?.review || ""
  );
  const [hideSubmit, setHideSubmit] = useState(
    props.appointment?.feedback || false
  );

  // Decrypt docname and date
  const decryptedDocName = decryptData(props.appointment.docname);
  const decryptedDate = decryptData(props.appointment.date);

  const handleSubmit = async () => {
    try {
      setLoader(true);
      const res = await api.writeFeedback({
        aptid: props.appointment.aptid,
        review: feedbackText,
        rating: value,
      });
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setLoader(false);
        if (!alert(res.data.msg)) {
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.errorMsg);
      setAlert(true);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoader(true);
      const res = await api.deleteFeedback({
        aptid: props.appointment.aptid,
      });
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setLoader(false);
        if (!alert(res.data.msg)) {
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.errorMsg);
      setAlert(true);
      console.error(error);
    }
  };

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Rate Your Appointment with
        </Typography>
        <Typography variant="h5" component="div">
          {decryptedDocName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`on ${decryptedDate}`}
        </Typography>
        <br />
        <TextField
          fullWidth
          label="your feedback..."
          value={feedbackText}
          autoComplete="off"
          inputProps={{
            maxLength: 280,
          }}
          onChange={(event) => {
            setFeedbackText(event.target.value);
            setHideSubmit(false);
          }}
        />
        <CardActions disableSpacing>
          <Rating
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              setHideSubmit(false);
            }}
          />
          {hideSubmit ? (
            <Tooltip title="Delete your feedback">
              <Fab
                onClick={handleDelete}
                sx={{ color: "#f44336", marginLeft: "auto" }}
                aria-label="delete"
              >
                <DeleteIcon />
              </Fab>
            </Tooltip>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!feedbackText}
              variant="contained"
              sx={{ marginLeft: "auto" }}
            >
              Submit
            </Button>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
}
