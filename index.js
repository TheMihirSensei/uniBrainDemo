const express = require("express");
const app = express();
const mongoose = require("mongoose");
const apiRoute = require("./routes");
const config = require("./config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoute);

mongoose
  .connect("mongodb://localhost:27017/demo3")
  .then(async () => {
    app.listen(config.port, () => {
      console.log("server started");
    });

    console.log("mongodb conencted");
  })
  .catch((err) => {
    console.log("mongodb connection error");
  });
