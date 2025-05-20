const express = require("express");
const app = express();
const { Musician, Band } = require("../models");
const { db } = require("../db/connection");

const port = 3000;
app.use(express.json());
app.use(express.urlencoded());

//TODO: Create a GET /musicians route to return all musicians
app.get("/musicians", async (req, res) => {
  const musicians = await Musician.findAll();
  res.json(musicians);
});

app.get("/bands", async (req, res) => {
  const bands = await Band.findAll();
  res.json(bands);
});

app.get("/musicians/:id", async (req, res) => {
  const id = req.params.id;
  const musicians = await Musician.findByPk(id);
  res.json(musicians);
});

app.post("/musicians", async (req, res) => {
  const musician = await Musician.create(req.body);
  res.json(musician);
});

app.put("/musicians/:id", async (req, res) => {
  const musician = await Musician.findByPk(req.params.id);
  await musician.update(req.body);
  res.json(musician);
});

app.delete("/musicians/:id", async (req, res) => {
  const musician = await Musician.findByPk(req.params.id);
  await musician.destroy();
  res.send({ message: "Musician deleted" });
});

module.exports = app;
