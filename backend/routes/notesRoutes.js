const express = require("express");
const router = express.Router();
const {
  uploadNote,
  getAllNotes,
  getNoteById,
  getMyNotes,
  deleteNote,
} = require("../controllers/notesController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/", getAllNotes);
router.get("/:id", getNoteById);

// Protected routes
router.post("/upload", protect, upload.single("file"), uploadNote);
router.get("/my/notes", protect, getMyNotes);
router.delete("/:id", protect, deleteNote);

module.exports = router;