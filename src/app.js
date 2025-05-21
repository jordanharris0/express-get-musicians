const express = require("express");
const app = express();
const musicians = require("../routes/musicians");

const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/musicians", musicians);

module.exports = app;
