import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const UploadNote = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    price: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("subject", formData.subject);
      form.append("price", formData.price);
      form.append("file", file);

      await API.post("/notes/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Note uploaded successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Only sellers can upload notes
        </h2>
        <Link
          to="/"
          className="text-indigo-600 hover:underline font-medium"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar (same as Home) */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            📚 Smart Notes
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm font-medium">
              👋 {user.name}
            </span>
            <Link to="/dashboard">
              <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                Dashboard
              </button>
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Upload New Note
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter note title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Brief description of your notes"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. Data Structures"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter price"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 
                file:text-sm file:font-semibold 
                file:bg-indigo-50 file:text-indigo-600 
                hover:file:bg-indigo-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-70"
            >
              {loading ? "Uploading..." : "Upload Note"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadNote;