import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
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

    if (form.password !== form.password2) {
      setMsg("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE}/api/register/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok) {
        setIsSuccess(true);
        setMsg("Account created successfully! Redirecting to login...");
        setTimeout(() => nav("/login"), 1200);
      } else {
        // Extract validation errors nicely
        const errText = data.username || data.password || data.email || data.non_field_errors || JSON.stringify(data);
        setMsg(Array.isArray(errText) ? errText.join(" ") : String(errText));
      }
    } catch(err) {
      console.error(err);
      setMsg("Signup failed. Please verify connection to the backend.");
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
          <h2 className="text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">Create Account</h2>
          <p className="text-sm text-gray-500 mt-2">Sign up for a free account to get started shopping</p>
        </div>

        {/* Msg Banner */}
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
              placeholder="Pick a username" 
              required 
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Email Address</label>
            <input 
              name="email" 
              type="email" 
              onChange={handleChange} 
              value={form.email} 
              placeholder="you@example.com" 
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

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Confirm Password</label>
            <input 
              name="password2" 
              type="password" 
              onChange={handleChange} 
              value={form.password2} 
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
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-bold">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;
