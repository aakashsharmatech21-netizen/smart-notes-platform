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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#6c63ff" }}>📚 Smart Notes</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/"><button>Home</button></Link>
          {user?.role === "seller" && <Link to="/upload"><button>Upload Note</button></Link>}
          <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
      </div>

      <h2>Welcome, {user?.name} ({user?.role})</h2>

      {loading ? (
        <p>Loading...</p>
      ) : user?.role === "seller" ? (
        <>
          <h3>My Uploaded Notes ({myNotes.length})</h3>
          {myNotes.length === 0 ? (
            <p>No notes uploaded yet. <Link to="/upload">Upload your first note!</Link></p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {myNotes.map((note) => (
                <div key={note._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}>
                  <h3>{note.title}</h3>
                  <p>{note.subject}</p>
                  <p>₹{note.price}</p>
                  <p>Buyers: {note.buyers.length}</p>
                  <button
                    onClick={() => handleDelete(note._id)}
                    style={{ marginTop: "10px", width: "100%", backgroundColor: "#ff4444", color: "white", border: "none", borderRadius: "5px", padding: "8px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h3>Purchased Notes ({purchasedNotes.length})</h3>
          {purchasedNotes.length === 0 ? (
            <p>No notes purchased yet. <Link to="/">Browse Notes</Link></p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {purchasedNotes.map((note) => (
                <div key={note._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}>
                  <h3>{note.title}</h3>
                  <p>{note.subject}</p>
                  <a href={note.fileUrl} target="_blank" rel="noreferrer">
                    <button style={{ marginTop: "10px", width: "100%", backgroundColor: "#6c63ff", color: "white", border: "none", borderRadius: "5px", padding: "8px", cursor: "pointer" }}>
                      Download PDF
                    </button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;