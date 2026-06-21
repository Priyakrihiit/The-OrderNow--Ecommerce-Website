import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { clearTokens, getAccessToken } from '../utils/auth.js';
import { useState } from 'react';

function Navbar() {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        setMobileMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-150/80 fixed w-full top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="text-2xl">🏪</span>
                            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition duration-300">
                                OrderNow
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition duration-200">
                            Home
                        </Link>
                        {isLoggedIn && (
                            <Link to="/orders" className="text-gray-600 hover:text-blue-600 font-medium transition duration-200">
                                My Orders
                            </Link>
                        )}
                        
                        <div className="h-4 w-px bg-gray-200"></div>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-200 flex items-center gap-1.5 font-medium">
                            <span className="text-lg">🧺</span>
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-extrabold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-md animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Options */}
                        {!isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg transition duration-200">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition duration-200 shadow-sm hover:shadow-md">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium px-3 py-1.5 border border-gray-200 hover:border-red-200 rounded-lg transition duration-200">
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition">
                            <span className="text-lg">🧺</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-extrabold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-150 px-4 pt-2 pb-4 space-y-2 animate-fade-in">
                    <Link 
                        to="/" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                    >
                        Home
                    </Link>
                    {isLoggedIn && (
                        <Link 
                            to="/orders" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium"
                        >
                            My Orders
                        </Link>
                    )}
                    <hr className="border-gray-100 my-2" />
                    {!isLoggedIn ? (
                        <div className="space-y-2">
                            <Link 
                                to="/login" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center px-3 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center px-3 py-2.5 bg-blue-600 rounded-xl text-white font-semibold hover:bg-blue-700"
                            >
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <button 
                            onClick={handleLogout}
                            className="w-full text-center px-3 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium hover:bg-red-100/50"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;