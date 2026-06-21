import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  const handleAddToCart = async () => {
    if (!localStorage.getItem('access_token')) {
      navigate('/login');
      return;
    }
    setAdding(true);
    await addToCart(product.id);
    // Visual timeout for micro-animation success feedback
    setTimeout(() => {
      setAdding(false);
    }, 1000);
  };

  // Robust image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${BASEURL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error loading product</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/" className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">&larr; Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full bg-white shadow-sm border border-gray-150 rounded-3xl p-6 sm:p-8 md:p-12 animate-fade-in">
        
        {/* Navigation Breadcrumbs / Back button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition"
          >
            &larr; Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Image Column */}
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
            />
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {product.category && (
                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg mb-4">
                  {product.category.name}
                </span>
              )}
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-extrabold text-green-600">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">In Stock</span>
              </div>

              <div className="border-t border-b border-gray-100 py-6 mb-8">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {product.description || "No description provided for this product. Craftsmanship and reliability are standard."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart} 
                disabled={adding}
                className={`w-full font-bold text-lg px-8 py-4 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  adding 
                    ? "bg-green-600 text-white scale-[0.98]" 
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {adding ? (
                  <>
                    <span>Added to Cart! 🛒</span>
                  </>
                ) : (
                  <>
                    <span>Add to Cart</span>
                    <span>🛒</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium py-2">
                <div className="flex items-center gap-1.5">
                  🛡️ <span className="text-xs">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  🚚 <span className="text-xs">Fast Shipping</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;