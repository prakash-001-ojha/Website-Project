const express = require("express");
const router = express.Router();
const db = require("../db");

// Register user
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error("Registration error:", err);
      return res.status(500).send("Error registering user");
    }
    res.status(201).send("User registered successfully");
  });
});

module.exports = router;
