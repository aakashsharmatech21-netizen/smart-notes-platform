const Note = require("../models/Note");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate summary using Gemini
const generateSummary = async (title, description, subject) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a short 3-4 line summary for study notes:
      Title: ${title}
      Subject: ${subject}
      Description: ${description}
      Make it helpful for students.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini error:", error);
    return "";
  }
};

// Upload a note
// Upload a note
const uploadNote = async (req, res) => {
  try {
    const { title, description, subject, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    // ✅ Validate PDF only
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    // Generate AI summary
    console.log("Calling Gemini...");
    const summary = await generateSummary(title, description, subject);
    console.log("Summary generated:", summary);

    const note = await Note.create({
      title,
      description,
      subject,
      price,
      fileUrl: req.file.path,
      seller: req.user._id,
      summary,
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
// Get all notes (with search + filter)

const getAllNotes = async (req, res) => {
  try {
    const { keyword, subject, maxPrice } = req.query;
    console.log("SUBJECT RECEIVED:", subject);
    let filters = [];

    // 🔍 Search (multi-field)
    if (keyword && keyword.trim() !== "") {
      filters.push({
        $or: [
          { title: { $regex: keyword.trim(), $options: "i" } },
          { description: { $regex: keyword.trim(), $options: "i" } },
          { subject: { $regex: keyword.trim(), $options: "i" } },
        ],
      });
    }

    // 📚 Subject filter
    if (subject && subject.trim() !== "") {
     filters.push({
  subject: { $regex: `^${subject.trim()}$`, $options: "i" },
});
    }

    // 💰 Price filter
    if (maxPrice && maxPrice !== "") {
      filters.push({ price: { $lte: Number(maxPrice) } });
    }

    // 👉 Combine everything safely
    const finalQuery = filters.length > 0 ? { $and: filters } : {};

    console.log("FINAL QUERY:", finalQuery); // debug

    const notes = await Note.find(finalQuery)
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