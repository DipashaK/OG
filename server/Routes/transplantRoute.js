const express = require("express");
const Transplant = require("../Models/transplant");
const router = express.Router();

router.post("/", async (req, res) => {
  const { date, time, organ, recipient, location, endDate } = req.body;

  if (!date || !time || !organ || !recipient || !location || !endDate) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (new Date(endDate) < new Date(date)) {
    return res.status(400).json({ error: "End date cannot be before start date." });
  }

  try {
    const newTransplant = new Transplant({ date, time, organ, recipient, location, endDate });
    await newTransplant.save();
    res.json(newTransplant);
  } catch (error) {
    console.error("Error saving transplant:", error);
    res.status(500).json({ error: "Failed to save transplant." });
  }
});

router.get("/", async (req, res) => {
  try {
    const transplants = await Transplant.find();
    res.json(transplants);
  } catch (error) {
    console.error("Error fetching transplants:", error);
    res.status(500).json({ error: "Failed to fetch transplants." });
  }
});

module.exports = router;