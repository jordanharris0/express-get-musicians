const express = require("express");

const musicians = express.Router();
const { Musician, Band } = require("../models");

musicians.use(express.json());
musicians.use(express.urlencoded({ extended: true }));

musicians.get("/", async (req, res) => {
  const musicians = await Musician.findAll();
  res.json(musicians);
});

musicians.get("/bands", async (req, res) => {
  const bands = await Band.findAll();
  res.json(bands);
});

musicians.get("/:id", async (req, res) => {
  const id = req.params.id;
  const musicians = await Musician.findByPk(id);
  res.json(musicians);
});

musicians.post("/", async (req, res) => {
  const musician = await Musician.create(req.body);
  res.json(musician);
});

musicians.put("/:id", async (req, res) => {
  const musician = await Musician.findByPk(req.params.id);
  await musician.update(req.body);
  res.json(musician);
});

musicians.delete("/:id", async (req, res) => {
  const musician = await Musician.findByPk(req.params.id);
  await musician.destroy();
  res.send({ message: "Musician deleted" });
});

module.exports = musicians;
