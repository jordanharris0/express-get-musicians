const express = require("express");
const musicians = express.Router();
const { Musician } = require("../models");

const { check, validationResult } = require("express-validator");

musicians.use(express.json());
musicians.use(express.urlencoded({ extended: true }));

musicians.get("/", async (req, res) => {
  const musicians = await Musician.findAll();
  res.json(musicians);
});

musicians.get("/:id", async (req, res) => {
  const id = req.params.id;
  const musicians = await Musician.findByPk(id);
  res.json(musicians);
});

musicians.post(
  "/",
  [
    check("name")
      .not()
      .isEmpty()
      .isLength({ min: 2, max: 20 })
      .withMessage("Name must be between 2 and 20 characters"),
    check("instrument")
      .not()
      .isEmpty()
      .isLength({ min: 2, max: 20 })
      .withMessage("Instrument must be between 2 and 20 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const musician = await Musician.create(req.body);
      res.json(musician);
    }
  }
);

musicians.put(
  "/:id",
  [
    check("name")
      .not()
      .isEmpty()
      .isLength({ min: 2, max: 20 })
      .withMessage("Name must be between 2 and 20 characters"),
    check("instrument")
      .not()
      .isEmpty()
      .isLength({ min: 2, max: 20 })
      .withMessage("Instrument must be between 2 and 20 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const musician = await Musician.findByPk(req.params.id);
      await musician.update(req.body);
      res.json(musician);
    }
  }
);

musicians.delete("/:id", async (req, res) => {
  const musician = await Musician.findByPk(req.params.id);
  await musician.destroy();
  res.send({ message: "Musician deleted" });
});

module.exports = musicians;
