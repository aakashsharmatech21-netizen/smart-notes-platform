import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [myNotes, setMyNotes] = useState([]);
  const [purchasedNotes, setPurchasedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (user.role === "seller") {
        const { data } = await API.get("/notes/my/notes");
        setMyNotes(data.notes);
      } else {
        const { data } = await API.get("/payment/purchased");
        setPurchasedNotes(data.notes);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await API.delete(`/notes/${noteId}`);
      toast.success("Note deleted!");
      setMyNotes(myNotes.filter((n) => n._id !== noteId));
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">📚 Smart Notes</Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                Home
              </button>
            </Link>
            {user?.role === "seller" && (
              <Link to="/upload">
                <button className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                  + Upload Note
                </button>
              </Link>
            )}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-6 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name} 👋</h2>
            <p className="text-gray-400 text-sm mt-1">
              You are logged in as a{" "}
              <span className="text-indigo-600 font-semibold capitalize">{user?.role}</span>
            </p>
          </div>
          {/* Stats */}
          <div className="hidden sm:flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {user?.role === "seller" ? myNotes.length : purchasedNotes.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {user?.role === "seller" ? "Notes Listed" : "Notes Purchased"}
              </p>
            </div>
            {user?.role === "seller" && (
              <div>
                <p className="text-2xl font-bold text-indigo-600">
                  {myNotes.reduce((acc, n) => acc + n.buyers.length, 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Total Buyers</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-400 animate-pulse">Loading your dashboard...</p>
          </div>
        ) : user?.role === "seller" ? (

          /* ── Seller View ── */
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-5">
              My Uploaded Notes
              <span className="ml-2 text-sm font-normal text-gray-400">({myNotes.length})</span>
            </h3>

            {myNotes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-500 mb-4">No notes uploaded yet.</p>
                <Link to="/upload">
                  <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">
                    Upload Your First Note
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myNotes.map((note) => (
                  <div key={note._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="p-5 flex-1">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        {note.subject}
                      </span>
                      <h3 className="text-gray-800 font-semibold mt-3 mb-1 line-clamp-2">{note.title}</h3>
                      <p className="text-2xl font-bold text-indigo-600 mt-2">₹{note.price}</p>
                      <p className="text-xs text-gray-400 mt-1">{note.buyers.length} buyer{note.buyers.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="px-5 pb-5 flex gap-2">
                      <Link to={`/notes/${note._id}`} className="flex-1">
                        <button className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="flex-1 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>

        ) : (

          /* ── Buyer View ── */
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-5">
              Purchased Notes
              <span className="ml-2 text-sm font-normal text-gray-400">({purchasedNotes.length})</span>
            </h3>

            {purchasedNotes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-gray-500 mb-4">No notes purchased yet.</p>
                <Link to="/">
                  <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">
                    Browse Notes
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {purchasedNotes.map((note) => (
                  <div key={note._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="p-5 flex-1">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        {note.subject}
                      </span>
                      <h3 className="text-gray-800 font-semibold mt-3 mb-1 line-clamp-2">{note.title}</h3>
                      <p className="text-xs text-gray-400 mt-2">by {note.seller?.name}</p>
                    </div>
                    <div className="px-5 pb-5 flex gap-2">
                      <Link to={`/notes/${note._id}`} className="flex-1">
                        <button className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                          View
                        </button>
                      </Link>
                      <a href={note.fileUrl} target="_blank" rel="noreferrer" className="flex-1">
                        <button className="w-full py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                          📥 Download
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;