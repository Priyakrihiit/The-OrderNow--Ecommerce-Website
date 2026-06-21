import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters & Sorting state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("");

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    // Fetch categories on mount
    useEffect(() => {
        fetch(`${BASEURL}/api/categories/`)
            .then(res => res.ok ? res.json() : [])
            .then(data => setCategories(data))
            .catch(err => console.error("Error fetching categories:", err));
    }, [BASEURL]);

    // Fetch products based on filters
    useEffect(() => {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedCategory) queryParams.append("category", selectedCategory);
        if (searchQuery) queryParams.append("search", searchQuery);

        const url = `${BASEURL}/api/products/?${queryParams.toString()}`;

        // Debounced or direct fetch
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(url, { signal })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setLoading(false);
                setError(null);
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    setError(error.message);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [searchQuery, selectedCategory, BASEURL]);

    // Handle Client-side Sorting
    const sortedProducts = [...products].sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        return 0; // default order
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Section */}
                <div className="text-center py-8 mb-8 animate-fade-in">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Discover Quality Products
                    </h1>
                    <p className="mt-3 max-w-xl mx-auto text-base text-gray-500 sm:text-lg">
                        Shop the latest collections with premium quality items, curated categories, and seamless ordering.
                    </p>
                </div>

                {/* Filters, Search & Sorting Panel */}
                <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in">
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition duration-200"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery("")} 
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="relative w-full md:w-48">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-gray-600 font-medium transition duration-200 appearance-none cursor-pointer"
                        >
                            <option value="">Sort: Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">▼</span>
                    </div>
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 items-center justify-center sm:justify-start animate-fade-in">
                    <button
                        onClick={() => setSelectedCategory("")}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ${
                            selectedCategory === ""
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ${
                                selectedCategory === cat.slug
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-center mb-8">
                        ⚠️ Error: {error}. Please try again later.
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        // Skeleton Loader
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm animate-pulse">
                                <div className="aspect-square bg-gray-200 rounded-xl w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                                </div>
                            </div>
                        ))
                    ) : sortedProducts.length > 0 ? (
                        sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 bg-white border border-gray-150 rounded-2xl">
                            <span className="text-4xl">🔍</span>
                            <h3 className="mt-4 text-lg font-bold text-gray-800">No products found</h3>
                            <p className="mt-1 text-gray-500 text-sm">
                                Try refining your search query or choosing another category.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;