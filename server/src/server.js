const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:4200", "https://profilexpert.netlify.app"],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// routes
app.use("/auth", authRoute);
app.use("/users", userRoute);

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Error connecting to database:", err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
