const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePicture: String,
  age: {
    type: Number,
    required: true,
  },
  workExperiences: [
    {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: Date,
      current: Boolean,
      jobTitle: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      jobDescription: String,
    },
  ],
});

module.exports = mongoose.model("UserData", userDataSchema);
