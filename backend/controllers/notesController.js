const Note = require("../models/Note");

// Upload a note
const uploadNote = async (req, res) => {
  try {
    const { title, description, subject, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const note = await Note.create({
      title,
      description,
      subject,
      price,
      fileUrl: req.file.path,
      seller: req.user._id,
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single note
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get my uploaded notes (seller)
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Only seller can delete their own note
    if (note.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadNote,
  getAllNotes,
  getNoteById,
  getMyNotes,
  deleteNote,
};