const User = require("../models/userData");

exports.saveOrUpdateUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    let userData = await User.findOne({ userId: userId });

    if (!userData) {
      userData = new User({
        userId: userId,
        name: req.body.name,
        age: req.body.age,
        profilePicture: req.file ? req.file.path : "",
        workExperiences: req.body.workExperiences.map((experience) => ({
          startDate: experience.startDate,
          endDate: experience.endDate,
          current: experience.current,
          jobTitle: experience.jobTitle,
          company: experience.company,
          jobDescription: experience.jobDescription,
        })),
      });
    } else {
      userData.name = req.body.name;
      userData.age = req.body.age;
      userData.profilePicture = req.file
        ? req.file.path
        : userData.profilePicture;
      userData.workExperiences = req.body.workExperiences.map((experience) => ({
        startDate: experience.startDate,
        endDate: experience.endDate,
        current: experience.current,
        jobTitle: experience.jobTitle,
        company: experience.company,
        jobDescription: experience.jobDescription,
      }));
    }

    await userData.save();

    res
      .status(200)
      .json({ message: "Profile data saved/updated successfully" });
  } catch (error) {
    console.error("Error saving/updating profile data:", error);
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
