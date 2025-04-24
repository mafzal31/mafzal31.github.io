
// This section loads modules.  It loads the Express server and stores
// it in "express", then creates a application, a router, and a path handler
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// This part sets up the database
const {Pool} = require('pg');
// You may need to modify the password or database name in the following line:
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
// The default password is CTI_110_WakeTech
// The default database name is Gradebook
const pool = new Pool({connectionString:connectionString})

// This line says when it's looking for a file linked locally,
// check in sub-folder "public"
// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file at the root
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'gradebook.html'));
});

app.use("/", router);

// Main API route that returns student data + simulated grades
router.get('/api/grades', async function(req, res) {
  try {
    const result = await pool.query(
      `SELECT first_name, last_name FROM Students`
    );

    const studentsWithGrades = result.rows.map(student => ({
      student_name: `${student.first_name} ${student.last_name}`,
      assignment1: Math.floor(Math.random() * 21) + 80, // 80–100
      assignment2: Math.floor(Math.random() * 21) + 70, // 70–90
      assignment3: Math.floor(Math.random() * 21) + 60  // 60–80
    }));

    // Log for confirmation
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
