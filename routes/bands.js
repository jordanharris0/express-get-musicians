const express = require("express");
const bands = express.Router();
const { Band, Musician } = require("../models");

bands.use(express.json());
bands.use(express.urlencoded({ extended: true }));

//get bands and their musicians
bands.get("/", async (req, res) => {
  const bands = await Band.findAll({ include: Musician });

  if (!bands) {
    return res.status(404).send({ message: "No bands found" });
  }
  res.status(200).json(bands);
});

//get bands by id
bands.get("/:id", async (req, res) => {
  const band = await Band.findByPk(req.params.id, {
    include: Musician,
  });

  if (!band) {
    return res.status(404).send({ message: "Band not found" });
  }

  res.status(200).json(band);
});

module.exports = bands;
