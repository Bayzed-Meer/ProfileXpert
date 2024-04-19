const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  designation: {
    type: String,
  },
  profilePicture: String,
  age: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 18;
      },
      message: "Age must be above or equal 18",
    },
  },
  profileSummary: {
    type: String,
  },
  workExperiences: [
    {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
        validate: {
          validator: function (value) {
            return !value || value >= this.startDate;
          },
          message: "End date must be after start date",
        },
      },
      current: {
        type: Boolean,
      },
      jobTitle: {
        type: String,
      },
      company: {
        type: String,
      },
      jobDescription: String,
    },
  ],
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
