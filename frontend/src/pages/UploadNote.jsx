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
    if (!file) { toast.error("Please select a PDF file"); return; }
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Sellers Only</h2>
        <p className="text-slate-400 text-sm mb-6">You need to be a seller to upload notes.</p>
        <Link to="/" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-slate-800">Smart<span className="text-indigo-600">Notes</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-sm font-medium hidden sm:block">👋 {user.name}</span>
            <Link to="/dashboard">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">
                Dashboard
              </button>
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-10 px-6 text-center">
        <span className="inline-block bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">Seller Dashboard</span>
        <h1 className="text-3xl font-extrabold">Upload a New Note</h1>
        <p className="text-indigo-200 text-sm mt-2">Share your knowledge and earn money</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Complete Data Structures Notes"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Brief description of your notes..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 resize-none"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                >
                  <option value="">All Subjects</option>
                  <option value="Data structures">Data structures</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="AI">AI</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 49"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">PDF File</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50 hover:border-indigo-400 transition">
                  <p className="text-3xl mb-2">📄</p>
                  <p className="text-sm text-slate-500 mb-3">
                    {file ? file.name : "Click to select a PDF file"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition"
                  >
                    Browse File
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl transition text-sm shadow-sm hover:shadow-md"
              >
                {loading ? "Uploading... ⏳" : "Upload Note →"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNote;