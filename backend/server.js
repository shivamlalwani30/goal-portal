const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./src/db/connectDB");

const authRoutes = require("./src/routes/authRoutes");
const goalRoutes = require("./src/routes/goalRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use(
  "/api/employees",
  employeeRoutes
);

// HEALTH ROUTE
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Goal Portal API Running...");
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});