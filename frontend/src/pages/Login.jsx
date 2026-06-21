import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveTokens } from "../utils/auth";

function Login() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const nav = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    setIsSuccess(false);
    
    try {
      const res = await fetch(`${BASE}/api/token/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        saveTokens(data);
        setIsSuccess(true);
        setMsg("Welcome back! Login successful. Redirecting...");
        setTimeout(() => {
          // Force a full reload to refresh the Navbar state easily, or navigate
          nav("/");
          window.location.reload();
        }, 800);
      } else {
        setMsg(data.detail || "Invalid username or password. Please try again.");
      }
    } catch(err) {
      console.error(err);
      setMsg("Connection failed. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center p-6 pt-20">
      <div className="max-w-md w-full bg-white border border-gray-150 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl">🏪</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-2">Log in to manage your basket and place orders</p>
        </div>

        {/* Status messages */}
        {msg && (
          <div className={`p-4 rounded-xl text-sm font-semibold mb-6 border ${
            isSuccess 
              ? "bg-green-50 text-green-700 border-green-100" 
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            {isSuccess ? "✅" : "⚠️"} {msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Username</label>
            <input 
              name="username" 
              type="text"
              onChange={handleChange} 
              value={form.username} 
              placeholder="Your username" 
              required 
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Password</label>
            <input 
              name="password" 
              type="password" 
              onChange={handleChange} 
              value={form.password} 
              placeholder="••••••••" 
              required 
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition"
            />
          </div>

          <button 
            disabled={loading}
            className={`w-full font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              loading 
                ? "bg-gray-400 text-white cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-bold">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
