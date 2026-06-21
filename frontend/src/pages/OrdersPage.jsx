import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await authFetch(`${BASEURL}/api/orders/`);
        if (!res.ok) {
          throw new Error("Failed to fetch order history");
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [BASEURL]);

  if (loading) {
    return (
      <div className="pt-28 min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load orders</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight flex items-center gap-3">
          📦 My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🛍️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders placed yet</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Looks like you haven't made any purchases yet. Explore our top quality products and order today!
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 text-sm">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-gray-400 font-medium uppercase tracking-wider text-xs mb-0.5">Order Placed</p>
                      <p className="text-gray-700 font-semibold">
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium uppercase tracking-wider text-xs mb-0.5">Order ID</p>
                      <p className="text-gray-700 font-mono font-semibold">#{order.id}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium uppercase tracking-wider text-xs mb-0.5 text-right sm:text-right">Total Price</p>
                    <p className="text-lg font-bold text-green-600">${parseFloat(order.total_amount).toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 divide-y divide-gray-100">
                  {order.items && order.items.map((item) => {
                    const imgUrl = item.product_image 
                      ? (item.product_image.startsWith("http") ? item.product_image : `${BASEURL}${item.product_image}`)
                      : null;
                    return (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={item.product_name} 
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">📦</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-800 truncate">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: <span className="font-semibold text-gray-700">{item.quantity}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">each</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
