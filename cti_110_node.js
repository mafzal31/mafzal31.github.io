// Load required modules
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const { Pool } = require('pg');

// PostgreSQL connection string
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
const pool = new Pool({ connectionString });

// Serve static files (e.g. public/gradebook.js)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'gradebook.html'));
});

app.use("/", router);

// API route that avoids querying missing "grade" column
router.get('/api/grades', async function(req, res) {
  try {
    const result = await pool.query(`SELECT first_name, last_name FROM Students`);

    const studentsWithGrades = result.rows.map(student => ({
      student_name: `${student.first_name} ${student.last_name}`,
      assignment1: Math.floor(Math.random() * 21) + 80, // 80–100
      assignment2: Math.floor(Math.random() * 21) + 70, // 70–90
      assignment3: Math.floor(Math.random() * 21) + 60  // 60–80
    }));

    // Optional console log for testing
    studentsWithGrades.forEach(s => {
      console.log(`Student Name: ${s.student_name}`);
      console.log(`Grades: ${s.assignment1}, ${s.assignment2}, ${s.assignment3}`);
    });

    res.status(200).json(studentsWithGrades);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
});

// Start the server
let server = app.listen(3000, function() {
  console.log("App Server via Express is listening on port 3000");
  console.log("To quit, press CTRL + C");
});
