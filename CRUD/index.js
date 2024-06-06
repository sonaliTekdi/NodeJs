const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

const mongoose = require("mongoose");
//connection
mongoose
  .connect("mongodb://localhost:27017/myfirstdb")
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed"));

//schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
  },
  job_title: {
    type: String,
  },
});

const User = mongoose.model("user", userSchema);

//Middleware
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});
  console.log(allDbUsers, "allDbUsers");
});

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

app.post("/api/users/", async (req, res) => {
  try {
    const body = req.body;
    if (
      !body ||
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.gender ||
      !body.job_title
    ) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }
    const result = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      gender: body.gender,
      job_title: body.job_title,
    });
    return res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res
      .status(409)
      .json({ message: "user with this email id alrady exists." });
  }
});

app.delete("/api/delete/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1)[0];
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete user data" });
      }
      return res.json({ status: "success", deletedUser });
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to update user data" });
      }
      return res.json({ status: "success", updatedUser });
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
