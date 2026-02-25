require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

module.exports = app;
