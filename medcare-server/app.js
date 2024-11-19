// import "./env.js";
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import api from "./routes/index.js";

// const app = express();

// //const { USER_NAME, PASSWORD } = process.env;
// //const uri = `mongodb://${USER_NAME}:${PASSWORD}@cluster0-shard-00-00.kmfwq.mongodb.net:27017,cluster0-shard-00-01.kmfwq.mongodb.net:27017,cluster0-shard-00-02.kmfwq.mongodb.net:27017/MedCare?ssl=true&replicaSet=atlas-a9v4hk-shard-0&authSource=admin&retryWrites=true&w=majority`;

// //use the following uri when running local MongoDB server
// const uri = "mongodb://localhost:27017/MedCare";

// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("connected to DB"))
//   .catch((err) => console.log(err));

// app.use(express.static("public"));

// app.use(cors());

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "public/index.html");
// });

// app.use("/api", api);

// const port = process.env.PORT || 5000;

// app.listen(port, function () {
//   console.log("Server started on port: ", port);
// });



import "./env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import api from "./routes/index.js";
//for SSL
// Import necessary modules
import fs from "fs";
import https from "https";

const app = express();

//const { USER_NAME, PASSWORD } = process.env;
//const uri = `mongodb://${USER_NAME}:${PASSWORD}@cluster0-shard-00-00.kmfwq.mongodb.net:27017,cluster0-shard-00-01.kmfwq.mongodb.net:27017,cluster0-shard-00-02.kmfwq.mongodb.net:27017/MedCare?ssl=true&replicaSet=atlas-a9v4hk-shard-0&authSource=admin&retryWrites=true&w=majority`;

//use the following uri when running local MongoDB server
const uri = "mongodb://localhost:27017/MedCare";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

app.use(express.static("public"));

// app.use(cors());
//The CORS middleware ensures that your frontend at https://localhost:3000 
//is allowed to communicate with the backend at https://localhost:5000
app.use(cors({
  origin: "https://localhost:3000",
  credentials: true,
}));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.use("/api", api);

// SSL Options for HTTPS
const sslOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

// const port = process.env.PORT || 5000;

// app.listen(port, function () {
//   console.log("Server started on port: ", port);
// });


// Use HTTPS to start the server on port 5000 (or any desired port)
const port = process.env.PORT || 5000;

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server started on https://localhost:${port}`);
});

