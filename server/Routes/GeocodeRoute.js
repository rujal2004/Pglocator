const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /api/v1/geocode?address=Indiranagar Bangalore
router.get("/", async (req, res) => {
    console.log("GeocodeRoute loaded");
  const address = req.query.address;

  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    const response = await axios.get(
      "https://us1.locationiq.com/v1/search",
      {
        params: {
          key: process.env.LOCATIONIQ_KEY,
          q: address,
          format: "json"
        }
      }
    );

    if (!response.data.length) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(response.data[0]);

  } catch (error) {
    console.error("Geocode Error:", error.message);
    res.status(500).json({ message: "Geocoding failed" });
  }
});

module.exports = router;