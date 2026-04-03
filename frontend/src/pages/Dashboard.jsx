import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [myNotes, setMyNotes] = useState([]);
  const [purchasedNotes, setPurchasedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, changeRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
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
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-slate-800">Smart<span className="text-indigo-600">Notes</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">
                Home
              </button>
            </Link>
            {user?.role === "seller" && (
              <Link to="/upload">
                <button className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm">
                  + Upload Note
                </button>
              </Link>
            )}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-8 mb-8 flex items-center justify-between text-white">
          <div>
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-1">Dashboard</p>
            <h2 className="text-3xl font-extrabold">Welcome, {user?.name} 👋</h2>
            <p className="text-indigo-200 text-sm mt-1">
              Logged in as{" "}
              <span className="text-white font-bold capitalize bg-white/10 px-2 py-0.5 rounded-full">{user?.role}</span>
            </p>
            <button
              onClick={changeRole}
              className="mt-4 px-4 py-2 text-sm bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition shadow-sm"
            >
              Switch to {user?.role === "seller" ? "Buyer" : "Seller"} Mode
            </button>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex gap-8 text-center">
            <div className="bg-white/10 rounded-xl px-6 py-4">
              <p className="text-3xl font-extrabold">
                {user?.role === "seller" ? myNotes.length : purchasedNotes.length}
              </p>
              <p className="text-indigo-200 text-xs mt-1">
                {user?.role === "seller" ? "Notes Listed" : "Notes Purchased"}
              </p>
            </div>
            {user?.role === "seller" && (
              <div className="bg-white/10 rounded-xl px-6 py-4">
                <p className="text-3xl font-extrabold">
                  {myNotes.reduce((acc, n) => acc + n.buyers.length, 0)}
                </p>
                <p className="text-indigo-200 text-xs mt-1">Total Buyers</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-1.5 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>

        ) : user?.role === "seller" ? (

          /* ── Seller View ── */
          <>
            <h3 className="text-xl font-bold text-slate-800 mb-5">
              My Uploaded Notes
              <span className="ml-2 text-sm font-normal text-slate-400">({myNotes.length})</span>
            </h3>

            {myNotes.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
                <p className="text-6xl mb-4">📭</p>
                <p className="text-slate-500 font-medium mb-4">No notes uploaded yet.</p>
                <Link to="/upload">
                  <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition shadow-sm">
                    Upload Your First Note
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myNotes.map((note) => (
                  <div key={note._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
                    <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <div className="p-5 flex-1">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {note.subject}
                      </span>
                      <h3 className="text-slate-800 font-bold mt-3 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-xl font-extrabold text-indigo-600">₹{note.price}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {note.buyers.length} buyer{note.buyers.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="px-5 pb-5 flex gap-2 border-t border-slate-50 pt-4">
                      <Link to={`/notes/${note._id}`} className="flex-1">
                        <button className="w-full py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition">
                          View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="flex-1 py-2 text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition"
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
            <h3 className="text-xl font-bold text-slate-800 mb-5">
              Purchased Notes
              <span className="ml-2 text-sm font-normal text-slate-400">({purchasedNotes.length})</span>
            </h3>

            {purchasedNotes.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
                <p className="text-6xl mb-4">🛒</p>
                <p className="text-slate-500 font-medium mb-4">No notes purchased yet.</p>
                <Link to="/">
                  <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition shadow-sm">
                    Browse Notes
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {purchasedNotes.map((note) => (
                  <div key={note._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
                    <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <div className="p-5 flex-1">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {note.subject}
                      </span>
                      <h3 className="text-slate-800 font-bold mt-3 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2">by {note.seller?.name}</p>
                    </div>
                    <div className="px-5 pb-5 flex gap-2 border-t border-slate-50 pt-4">
                      <Link to={`/notes/${note._id}`} className="flex-1">
                        <button className="w-full py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition">
                          View
                        </button>
                      </Link>
                      <a href={note.fileUrl} target="_blank" rel="noreferrer" className="flex-1">
                        <button className="w-full py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
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