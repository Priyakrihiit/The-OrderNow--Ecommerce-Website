import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  // Bulletproof image URL resolution helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${BASEURL}${imagePath}`;
  };

  return (
    <Link to={`/product/${product.id}`} className="group flex">
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col w-full">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div className="space-y-1">
            <h3 className="text-gray-800 font-semibold group-hover:text-blue-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-extrabold text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition duration-300">
              View details &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
