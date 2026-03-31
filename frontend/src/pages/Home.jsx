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
        setNotes(data.notes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout.current);
  }, [keyword, subject, maxPrice]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">📚 Smart Notes</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-gray-600 text-sm font-medium">👋 {user.name}</span>
                <Link to="/dashboard">
                  <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">Dashboard</button>
                </Link>
                {user.role === "seller" && (
                  <Link to="/upload">
                    <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">+ Upload Note</button>
                  </Link>
                )}
                <button onClick={logout} className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">Login</button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-indigo-600 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Find the Best Study Notes</h1>
        <p className="text-indigo-200 text-lg">Buy and sell high-quality notes from students like you</p>
      </div>

      {/* Notes Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Notes</h2>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="w-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-400 text-lg animate-pulse">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-lg">No notes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
                <div className="p-5 flex-1">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{note.subject}</span>
                  <h3 className="text-gray-800 font-semibold text-lg mt-3 mb-1 line-clamp-2">{note.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{note.description}</p>
                </div>
                <div className="px-5 pb-5 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">₹{note.price}</p>
                    <p className="text-xs text-gray-400">by {note.seller?.name}</p>
                  </div>
                  <Link to={`/notes/${note._id}`}>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg">View</button>
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