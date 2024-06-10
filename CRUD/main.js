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

// get All Users
app.get("/get/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM emp_data");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create User
app.post("/create/users", async (req, res) => {
  const { id, fname, lname, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO emp_data (id, fname, lname, age) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, fname, lname, age]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

//Delete User
app.delete("/delete/user/:id", async (req, res) => {
  const { id } = req.params;
  // console.log("request", req);
  // console.log("response", res);
  try {
    const result = await pool.query("DELETE FROM emp_data WHERE id = $1", [id]);
    res.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    res.status(500).send(`Error deleting user: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
