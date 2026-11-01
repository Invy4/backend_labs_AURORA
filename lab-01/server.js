
const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Express Server!");
});

// About route
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "ANKAM CHARAN",
    section: "223 2A"
  });
});

// Time route
app.get("/time", (req, res) => {
  res.status(200).send(new Date().toString());
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Server configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server running on port ${PORT}`);
});

