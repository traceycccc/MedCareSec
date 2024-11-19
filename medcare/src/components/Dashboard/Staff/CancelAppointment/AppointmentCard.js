import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import api from "../../../../api";
import { useAuth } from "../../../../AuthContext";
import CryptoJS from "crypto-js";

const encryptionKey = "s3cur3Pa$$w0rdEncryp7ionK3y123456"; // Ensure this matches the backend

// Utility function to decrypt data
const decryptData = (data) => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return data; // Return the original data if decryption fails
  }
};

export default function AppointmentCard(props) {
  const { setLoader, setAlert, setAlertMsg } = useAuth();

  const handleCancel = async () => {
    const aptid = props.appointment.aptid;
    try {
      setLoader(true);
      const res = await api.cancelAppointment({ aptid });
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
      setAlertMsg(error?.response?.data?.errorMsg || "An Error Occured!");
      setAlert(true);
      console.error(error);
    }
  };

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography
          sx={{ fontSize: "0.9rem" }}
          color="text.secondary"
          gutterBottom
        >
          Appointment with
        </Typography>
        <Typography variant="h5" component="div">
          {decryptData(props.appointment.docname)}
        </Typography>
        <Typography sx={{ mb: 2.5, fontSize: "0.8rem" }} color="text.secondary">
          {decryptData(props.appointment.speciality)}
        </Typography>
        <Typography
          sx={{ mb: 1.5, fontSize: "1rem" }}
          color="text.secondary"
        >{`${decryptData(props.appointment.date)} (${decryptData(
          props.appointment.time
        )})`}</Typography>
        <br />
        <CardActions sx={{ justifyContent: "space-between" }} disableSpacing>
          <Button
            variant="contained"
            color="error"
            size="small"
            endIcon={<Cancel />}
            onClick={handleCancel}
            disabled={props.appointment.cancel || props.appointment.payment}
          >
            Cancel
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
