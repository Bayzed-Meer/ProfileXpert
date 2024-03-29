const User = require("../models/userData");

exports.createUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = new User({
      userId: userId,
      name: req.body.name,
      age: req.body.age,
      profilePicture: req.file.path,
      workExperiences: req.body.workExperiences.map((experience) => ({
        startDate: experience.startDate,
        endDate: experience.endDate,
        current: experience.current,
        jobTitle: experience.jobTitle,
        company: experience.company,
      })),
    });

    await user.save();

    res.status(201).json({ message: "Profile data saved successfully" });
  } catch (error) {
    console.error("Error saving profile data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findOne({ userId: userId });

    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
