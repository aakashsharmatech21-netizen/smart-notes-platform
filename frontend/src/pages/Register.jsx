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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      {/* Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

        {/* Top bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 justify-center">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-slate-800">Smart<span className="text-indigo-600">Notes</span></span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-800 mt-5">Create your account</h2>
            <p className="text-slate-400 text-sm mt-1">Join thousands of students today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Aakash Sharma"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-slate-50"
              />
            </div>

            {/* Role Toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "buyer" })}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold transition ${
                    formData.role === "buyer"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  🛒 Buy Notes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "seller" })}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold transition ${
                    formData.role === "seller"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  📤 Sell Notes
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl transition text-sm shadow-sm hover:shadow-md"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;