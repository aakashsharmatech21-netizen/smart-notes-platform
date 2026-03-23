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
      const { data: orderData } = await API.post("/payment/create-order", {
        noteId: note._id,
      });
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-lg animate-pulse">Loading note...</p>
    </div>
  );
  if (!note) return null;

  const isSeller = user && note.seller._id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">📚 Smart Notes</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Back */}
        <Link to="/" className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-6">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Top Banner */}
          <div className="bg-indigo-600 px-8 py-6">
            <span className="text-xs font-semibold text-indigo-200 bg-indigo-500 px-3 py-1 rounded-full">
              {note.subject}
            </span>
            <h1 className="text-2xl font-bold text-white mt-3">{note.title}</h1>
            <p className="text-indigo-200 text-sm mt-1">by {note.seller?.name}</p>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</h3>
              <p className="text-gray-700">{note.description}</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">₹{note.price}</p>
                <p className="text-xs text-gray-400 mt-1">Price</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-700">{note.buyers.length}</p>
                <p className="text-xs text-gray-400 mt-1">Buyers</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-700">PDF</p>
                <p className="text-xs text-gray-400 mt-1">Format</p>
              </div>
            </div>

            {/* AI Summary */}
            {note.summary && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-indigo-700 mb-2">🤖 AI Summary</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{note.summary}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              {isSeller ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4">
                  <span className="text-lg">✅</span>
                  <p className="font-medium text-sm">This is your note — listed on the marketplace</p>
                </div>
              ) : purchased ? (
                <a href={note.fileUrl} target="_blank" rel="noreferrer">
                  <button className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition text-base">
                    📥 Download PDF
                  </button>
                </a>
              ) : (
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl transition text-base"
                >
                  {buying ? "Processing payment..." : `Buy Now — ₹${note.price}`}
                </button>
              )}
            </div>

            {/* Login nudge for guests */}
            {!user && (
              <p className="text-center text-sm text-gray-400">
                <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link> to purchase this note
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;