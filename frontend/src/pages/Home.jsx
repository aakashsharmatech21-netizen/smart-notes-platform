import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [subject, setSubject] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const searchTimeout = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/notes", {
          params: { keyword, subject, maxPrice },
        });
        setNotes(data.notes || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(searchTimeout.current);
  }, [keyword, subject, maxPrice]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-black tracking-widest text-slate-800">SMART<span className="text-indigo-600">NOTES</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-slate-600 text-sm font-medium hidden sm:block">👋 {user.name}</span>
                <Link to="/dashboard">
                  <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">Dashboard</button>
                </Link>
                {user.role === "seller" && (
                  <Link to="/upload">
                    <button className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm">+ Upload</button>
                  </Link>
                )}
                <button onClick={logout} className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">Login</button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm">Get Started</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-20 px-6 text-center">
        <span className="inline-block bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">Smart Education Platform</span>
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">Find the Best <br/>Study Notes</h1>
        <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">Buy and sell high-quality notes from students like you. AI-powered summaries included.</p>
        {!user && (
          <Link to="/register">
            <button className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg text-sm">
              Start for Free →
            </button>
          </Link>
        )}
      </div>

      {/* Notes Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Browse Notes</h2>
            <p className="text-slate-500 text-sm mt-1">Find notes for your subject</p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search notes..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-56"
            />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Subjects</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-32"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-2 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-xl font-semibold text-slate-700">No notes found</p>
            <p className="text-slate-400 text-sm mt-2">Try a different search or subject filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="p-5 flex-1">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {note.subject}
                  </span>
                  <h3 className="text-slate-800 font-bold text-base mt-3 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{note.description}</p>
                </div>
                <div className="px-5 pb-5 flex items-center justify-between border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-xl font-extrabold text-indigo-600">₹{note.price}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                        {note.seller?.name?.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-xs text-slate-400">{note.seller?.name}</p>
                    </div>
                  </div>
                  <Link to={`/notes/${note._id}`}>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition shadow-sm hover:shadow-md">
                      View →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;