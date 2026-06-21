import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const nav = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    // Basic Validation
    if (!form.phone.trim().match(/^\d{10,}$/)) {
      setErrorMsg("Please enter a valid phone number (at least 10 digits).");
      setSubmitting(false);
      return;
    }

    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        alert("Order placed successfully!");
        nav("/orders");
      } else {
        setErrorMsg(data.error || "Failed to place order.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMsg("Something went wrong. Please check your network and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto animate-fade-in">
        
        {/* Navigation Link */}
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition">
            &larr; Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          🔒 Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Checkout Form (2/3 width) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">
                Shipping & Contact Information
              </h2>

              {errorMsg && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Delivery Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street name, Apt #, City, Zipcode"
                  required
                  rows="3"
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Payment Method</label>
                <div className="relative">
                  <select
                    name="payment_method"
                    value={form.payment_method}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-gray-700 font-semibold appearance-none cursor-pointer"
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="ONLINE">Online Payment (Mocked)</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">▼</span>
                </div>
              </div>

            </div>

            <button 
              disabled={submitting || cartItems.length === 0}
              className={`w-full font-bold text-lg py-4 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                submitting 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>Place Order (${total.toFixed(2)})</span>
              )}
            </button>
          </form>

          {/* Cart Summary (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
              
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">
                Items in Order
              </h2>

              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: <span className="font-bold">{item.quantity}</span> &times; ${parseFloat(item.product_price).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total Due</span>
                  <span className="text-green-600 font-extrabold">${total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
