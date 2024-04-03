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
  designation: {
    type: String,
    required: true,
  },
  profilePicture: String,
  age: {
    type: Number,
    required: true,
  },
  profileSummary: {
    type: String,
    required: true,
  },
  workExperiences: [
    {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: function () {
          return !this.current;
        },
        validate: {
          validator: function (value) {
            return !value || value >= this.startDate;
          },
          message: "End date must be after start date",
        },
      },
      current: {
        type: Boolean,
        default: false,
      },
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

const User = mongoose.model("UserData", userDataSchema);

module.exports = User;
