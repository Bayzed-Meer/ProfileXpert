const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../middlewares/authenticateToken");

// Multer storage configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const firstName = req.body.name.split(" ")[0];
    const lastFourDigits = req.params.userId.slice(-4);
    const ext = path.extname(file.originalname);
    const fileName = `${firstName}${lastFourDigits}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Profile routes
router.get("/getProfile", authenticateToken, userController.getProfile);
router.post(
  "/createProfile",
  authenticateToken,
  upload.single("profilePicture"),
  userController.createProfile
);
router.patch(
  "/updateProfile",
  authenticateToken,
  upload.single("profilePicture"),
  userController.updateProfile
);

// Work experience routes
router.get(
  "/getWorkExperience/:id",
  authenticateToken,
  userController.getWorkExperience
);
router.post(
  "/addWorkExperience",
  authenticateToken,
  userController.addWorkExperience
);
router.patch(
  "/updateWorkExperience/:id",
  authenticateToken,
  userController.updateWorkExperience
);
router.delete(
  "/deleteWorkExperience/:id",
  authenticateToken,
  userController.deleteWorkExperience
);

// Sharing profile route
router.get("/getSharedUser", authenticateToken, userController.getSharedUser);
router.get(
  "/getSharedUserData/:userId",
  authenticateToken,
  userController.getSharedUserData
);
router.post("/shareProfile", authenticateToken, userController.shareProfile);

module.exports = router;
