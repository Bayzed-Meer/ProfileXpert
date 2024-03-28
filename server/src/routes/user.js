const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/:userId",
  (req, res, next) => {
    const fields = [
      { name: "profilePicture", maxCount: 1 },
      { name: "name" },
      { name: "age" },
    ];

    if (req.body.workExperiences) {
      req.body.workExperiences.forEach((experience, index) => {
        fields.push(
          { name: `workExperiences[${index}][startDate]` },
          { name: `workExperiences[${index}][endDate]` },
          { name: `workExperiences[${index}][current]` },
          { name: `workExperiences[${index}][jobTitle]` },
          { name: `workExperiences[${index}][company]` },
          { name: `workExperiences[${index}][jobDescription]` },
          { name: `workExperiences[${index}][companyLogo]` }
        );
      });
    }

    upload.fields(fields)(req, res, (err) => {
      console.log(req);

      if (err) {
        return res
          .status(400)
          .json({ message: "File upload failed", error: err });
      }
      next();
    });
  },
  userController.createUserData
);

module.exports = router;
