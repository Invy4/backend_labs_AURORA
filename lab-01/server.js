const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Express Server!");
});

app.get("/about", (req, res) => {
  res.status(200).json({
    name: "ANKAM CHARAN",
    section: "223 2A",
  });
});

app.get("/time", (req, res) => {
  res.status(200).send(new Date().toString());
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(3000, () => {
  console.log("Express server running at http://localhost:3000/");
});
