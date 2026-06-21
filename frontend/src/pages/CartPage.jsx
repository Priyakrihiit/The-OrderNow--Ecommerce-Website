import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    // Robust image URL helper
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }
        return `${BASEURL}${imagePath}`;
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto animate-fade-in">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                    🛒 Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🧺</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-sans">Your cart is empty</h2>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                            Looks like you haven't added anything to your cart yet. Explore our products and start adding items!
                        </p>
                        <Link 
                            to="/" 
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md hover:shadow-lg"
                        >
                            Go Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart items list (2/3 width on large) */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center gap-6"
                                >
                                    {/* Product Image */}
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                        {item.product_image ? (
                                            <img
                                                src={getImageUrl(item.product_image)}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">📦</div>
                                        )}
                                    </div>

                                    {/* Name and Price */}
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <h2 className="text-lg font-bold text-gray-900 truncate">
                                            {item.product_name}
                                        </h2>
                                        <p className="text-base font-semibold text-gray-500 mt-1">
                                            ${parseFloat(item.product_price).toFixed(2)}
                                        </p>
                                        <p className="text-sm font-medium text-blue-600 mt-2">
                                            Subtotal: ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                                            <button 
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black font-extrabold hover:bg-gray-200/50 rounded-lg transition"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                                            <button 
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black font-extrabold hover:bg-gray-200/50 rounded-lg transition"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <button 
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-xl transition duration-200"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Remove item"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary sidebar (1/3 width on large) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm sticky top-24">
                                <h2 className="text-xl font-extrabold text-gray-900 border-b border-gray-100 pb-4 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 text-sm font-medium text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                                        <span className="text-gray-900">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Taxes</span>
                                        <span className="text-gray-900">$0.00</span>
                                    </div>
                                    <hr className="border-gray-100 my-4" />
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Total Amount</span>
                                        <span className="text-green-600 font-extrabold">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link 
                                        to="/checkout" 
                                        className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition shadow-md hover:shadow-lg active:scale-[0.98] text-center"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>

                                <div className="mt-4 text-center">
                                    <Link 
                                        to="/" 
                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        Continue Shopping &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;