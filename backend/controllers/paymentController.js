const Note = require("../models/Note");
const crypto = require("crypto");

// Create a mock order
const createOrder = async (req, res) => {
  try {
    const { noteId } = req.body;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if already purchased
    if (note.buyers.includes(req.user._id)) {
      return res.status(400).json({ message: "Already purchased" });
    }

    // Create mock order
    const mockOrder = {
      orderId: "order_" + crypto.randomBytes(8).toString("hex"),
      amount: note.price * 100, // in paise
      currency: "INR",
      noteId: note._id,
      noteTitle: note.title,
    };

    res.status(200).json({
      message: "Order created successfully",
      order: mockOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify mock payment and unlock note
const verifyPayment = async (req, res) => {
  try {
    const { noteId, orderId } = req.body;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Add buyer to note
    if (!note.buyers.includes(req.user._id)) {
      note.buyers.push(req.user._id);
      await note.save();
    }

    res.status(200).json({
      message: "Payment successful! Note unlocked.",
      fileUrl: note.fileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get purchased notes (buyer)
const getPurchasedNotes = async (req, res) => {
  try {
    const notes = await Note.find({ buyers: req.user._id }).populate(
      "seller",
      "name email"
    );

    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createOrder, verifyPayment, getPurchasedNotes };