import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const NoteDetail = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const { data } = await API.get(`/notes/${id}`);
      setNote(data.note);
      if (user && data.note.buyers.includes(user.id)) {
        setPurchased(true);
      }
    } catch (error) {
      toast.error("Note not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!user) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }
    setBuying(true);
    try {
      const { data: orderData } = await API.post("/payment/create-order", { noteId: note._id });
      const { data: verifyData } = await API.post("/payment/verify", {
        noteId: note._id,
        orderId: orderData.order.orderId,
      });
      toast.success("Payment successful! Note unlocked 🎉");
      setPurchased(true);
      window.open(verifyData.fileUrl, "_blank");
    } catch (error) {
      toast.error(error.response?.data?.message || "Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4 animate-pulse">📚</p>
        <p className="text-slate-400 animate-pulse">Loading note...</p>
      </div>
    </div>
  );
  if (!note) return null;

  const isSeller = user && note.seller._id === user.id;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold text-slate-800">Smart<span className="text-indigo-600">Notes</span></span>
          </Link>
          {user && (
            <Link to="/dashboard">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mb-6">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

          {/* Top gradient banner */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-8 py-8">
            <span className="inline-block text-xs font-semibold text-indigo-100 bg-white/10 px-3 py-1 rounded-full mb-4">
              {note.subject}
            </span>
            <h1 className="text-2xl font-extrabold text-white mb-2">{note.title}</h1>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                {note.seller?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="text-indigo-200 text-sm">by {note.seller?.name}</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-6">

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h3>
              <p className="text-slate-700 leading-relaxed">{note.description}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-indigo-600">₹{note.price}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Price</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-slate-700">{note.buyers.length}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Buyers</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-slate-700">PDF</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">Format</p>
              </div>
            </div>

            {/* AI Summary */}
            {note.summary && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5">
                <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
                  🤖 <span>AI Summary</span>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{note.summary}</p>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Action Button */}
            {isSeller ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-4">
                <span className="text-xl">✅</span>
                <p className="font-semibold text-sm">This is your note — listed on the marketplace</p>
              </div>
            ) : purchased ? (
              <a href={note.fileUrl} target="_blank" rel="noreferrer">
                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition text-base shadow-sm hover:shadow-md">
                  📥 Download PDF
                </button>
              </a>
            ) : (
              <button
                onClick={handleBuy}
                disabled={buying}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl transition text-base shadow-sm hover:shadow-md"
              >
                {buying ? "Processing payment... ⏳" : `Buy Now — ₹${note.price}`}
              </button>
            )}

            {/* Login nudge */}
            {!user && (
              <p className="text-center text-sm text-slate-400">
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link> to purchase this note
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;