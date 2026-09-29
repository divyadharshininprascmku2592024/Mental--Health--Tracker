const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((error) => console.log("MongoDB Connection Error:", error));

app.get("/", (req, res) => {
    res.send("Mental Health Tracker Backend Running");
});

const moodRoutes = require("./routes/moodRoutes");
app.use("/api/moods", moodRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
