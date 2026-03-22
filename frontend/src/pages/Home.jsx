import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await API.get("/notes");
        setNotes(data.notes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#6c63ff" }}>📚 Smart Notes</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {user ? (
            <>
              <span>👋 {user.name}</span>
              <Link to="/dashboard"><button>Dashboard</button></Link>
              {user.role === "seller" && <Link to="/upload"><button>Upload Note</button></Link>}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/register"><button>Register</button></Link>
            </>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      <h2>All Notes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes available yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {notes.map((note) => (
            <div key={note._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              <p><strong>Subject:</strong> {note.subject}</p>
              <p><strong>Price:</strong> ₹{note.price}</p>
              <p><strong>Seller:</strong> {note.seller?.name}</p>
              <Link to={`/notes/${note._id}`}>
                <button style={{ marginTop: "10px", width: "100%" }}>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;