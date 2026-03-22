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

      // Check if already purchased
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
      // Create order
      const { data: orderData } = await API.post("/payment/create-order", {
        noteId: note._id,
      });

      // Verify payment (mock)
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

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>;
  if (!note) return null;

  const isSeller = user && note.seller._id === user.id;

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <Link to="/">← Back to Home</Link>
      <h2 style={{ marginTop: "20px" }}>{note.title}</h2>
      <p><strong>Subject:</strong> {note.subject}</p>
      <p><strong>Description:</strong> {note.description}</p>
      <p><strong>Seller:</strong> {note.seller?.name}</p>
      <p><strong>Price:</strong> ₹{note.price}</p>
      <p><strong>Total Buyers:</strong> {note.buyers.length}</p>

      {note.summary && (
        <div style={{ backgroundColor: "#f5f5f5", padding: "15px", borderRadius: "8px", margin: "20px 0" }}>
          <h4>🤖 AI Summary</h4>
          <p>{note.summary}</p>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        {isSeller ? (
          <p style={{ color: "green" }}>✅ This is your note</p>
        ) : purchased ? (
          <a href={note.fileUrl} target="_blank" rel="noreferrer">
            <button style={{ width: "100%", padding: "12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
              📥 Download PDF
            </button>
          </a>
        ) : (
          <button
            onClick={handleBuy}
            disabled={buying}
            style={{ width: "100%", padding: "12px", backgroundColor: "#6c63ff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
          >
            {buying ? "Processing..." : `Buy Now ₹${note.price}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteDetail;