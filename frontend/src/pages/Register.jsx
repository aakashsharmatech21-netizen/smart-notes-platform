import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", formData);
      login(data.user, data.token);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600">📚 Smart Notes</Link>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Create an account</h2>
          <p className="text-gray-400 text-sm mt-1">Join thousands of students today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Aakash Sharma"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Role Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "buyer" })}
                className={`py-3 rounded-lg border-2 text-sm font-semibold transition ${
                  formData.role === "buyer"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                🛒 Buy Notes
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "seller" })}
                className={`py-3 rounded-lg border-2 text-sm font-semibold transition ${
                  formData.role === "seller"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                📤 Sell Notes
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-lg transition text-sm"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;