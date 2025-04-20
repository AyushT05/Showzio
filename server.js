// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000; // different port to avoid conflict with Next.js

app.use(cors());
app.use(express.json()); 

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

// Connect
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// API endpoint
app.get("/movies", (req, res) => {
  db.query("SELECT * FROM movies", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


app.post("/movies", (req, res) => {
  const { title, description, poster, rating } = req.body;

  console.log("Incoming movie data:", req.body); // 🔍 DEBUG

  if (!title || !description || !poster || rating === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const sql = `INSERT INTO movies (title, description, poster, rating) VALUES (?, ?, ?, ?)`;

  db.query(sql, [title, description, poster, rating], (err, result) => {
    if (err) {
      console.error("MySQL Insert Error:", err); // 🔍 DEBUG
      return res
        .status(500)
        .json({ success: false, message: "Database insert failed" });
    }

    res.json({ success: true, message: "Movie added successfully" });
  });
});


app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});



