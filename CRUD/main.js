const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3500;

// Middleware
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employee",
  password: "12345678",
  port: 5433,
});

app.get("/get/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM emp_data");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// app.post("/create/users", async (req, res) => {
//   const { id, fname, lname, age } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO emp_data (id,fname, lname, age) VALUES ($1, $2, $3,$4) RETURNING *",
//       [id, fname, lname, age]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
