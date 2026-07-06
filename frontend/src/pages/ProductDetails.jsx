import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/reducers/cartSlice.js";
import { toast } from "react-toastify";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { getProductImage } from "../utils/productImages";

// Helper function to return relevant mock specifications based on product category
const getProductSpecs = (product) => {
  const category = (product.category || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  
  if (category.includes("headphone") || category.includes("audio") || name.includes("headphone") || name.includes("earbud") || name.includes("airpod")) {
    return {
      general: [
        { label: "Brand", value: product.brand || "Apple" },
        { label: "Model", value: product.name || "AirPods Max Wireless Headphones" },
        { label: "Price", value: `Rs. ${Number(product.discountPrice || product.originalPrice || 0).toLocaleString()}` },
        { label: "Release date", value: "December 2020" },
        { label: "Model Number", value: "AirPods Max" },
        { label: "Headphone Type", value: "Over-Ear" },
        { label: "Connectivity", value: "Wireless" }
      ],
      details: [
        { label: "Microphone", value: "Yes" },
        { label: "Driver Type", value: "Dynamic" },
        { label: "Driver Size (mm)", value: "40" },
        { label: "Number of Drivers", value: "1" },
        { label: "Water Resistant", value: "No" },
        { label: "Weight (g)", value: "385.00" },
        { label: "Battery Life (Hrs)", value: "20" }
      ]
    };
  }
  
  if (category.includes("book") || name.includes("book") || name.includes("money") || name.includes("psychology")) {
    return {
      general: [
        { label: "Author", value: "Morgan Housel" },
        { label: "Publisher", value: "Harriman House" },
        { label: "Price", value: `Rs. ${Number(product.discountPrice || product.originalPrice || 0).toLocaleString()}` },
        { label: "Publication date", value: "September 2020" },
        { label: "ISBN-10", value: "0857197681" },
        { label: "Language", value: "English" },
        { label: "Format", value: "Paperback" }
      ],
      details: [
        { label: "Print length", value: "252 pages" },
        { label: "Dimensions", value: "5.5 x 0.6 x 8.5 inches" },
        { label: "Best Seller Rank", value: "#1 in Wealth Management" },
        { label: "Lexile Measure", value: "980L" },
        { label: "Grade Level", value: "10 - 12" },
        { label: "File Size", value: "3480 KB" },
        { label: "Text-to-Speech", value: "Enabled" }
      ]
    };
  }

  if (category.includes("furniture") || name.includes("chair") || name.includes("table") || name.includes("sofa")) {
    return {
      general: [
        { label: "Brand", value: "SleekWood" },
        { label: "Type", value: product.name || "Ergonomic Lounge Chair" },
        { label: "Price", value: `Rs. ${Number(product.discountPrice || product.originalPrice || 0).toLocaleString()}` },
        { label: "Color", value: "Oak / Charcoal" },
        { label: "Assembly Required", value: "Yes (Tools included)" },
        { label: "Frame Material", value: "Solid Oak Wood" },
        { label: "Upholstery", value: "Premium Linen Fabric" }
      ],
      details: [
        { label: "Maximum Weight Capacity", value: "300 lbs" },
        { label: "Product Dimensions", value: "32 x 34 x 38 inches" },
        { label: "Item Weight", value: "42 lbs" },
        { label: "Care Instructions", value: "Wipe with damp cloth" },
        { label: "Warranty", value: "2 Years Limited" },
        { label: "Seat Height", value: "18 inches" },
        { label: "Finish Type", value: "Natural Wood Grain" }
      ]
    };
  }

  // Fallback / General specs
  return {
    general: [
      { label: "Brand", value: product.brand || "Shopcart Brand" },
      { label: "Model", value: product.name || "Premium Quality Item" },
      { label: "Price", value: `Rs. ${Number(product.discountPrice || product.originalPrice || 0).toLocaleString()}` },
      { label: "Category", value: product.category || "General" },
      { label: "Condition", value: "New" },
      { label: "Availability", value: product.stock > 0 ? "In Stock" : "Out of Stock" },
      { label: "Seller", value: product.shop || "Verified Merchant" }
    ],
    details: [
      { label: "Shipping Weight", value: "1.2 lbs" },
      { label: "Product Origin", value: "Imported" },
      { label: "Item Model Number", value: `SC-${product._id?.slice(-6).toUpperCase() || "GENERIC"}` },
      { label: "Warranty Support", value: "30 Days Returns" },
      { label: "Package Dimensions", value: "10 x 8 x 3 inches" },
      { label: "Customer Reviews", value: "4.8 out of 5 stars" },
      { label: "Rank", value: "Top 100 in Category" }
    ]
  };
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Orange");
  const [quantity, setQuantity] = useState(1);

  // Similar Products State
  const { products } = useSelector((state) => state.product);
  const [allProducts, setAllProducts] = useState([]);

  const { cart } = useSelector((state) => state.cart);
  const isInCart = product ? cart.some((item) => item._id === product._id) : false;

  const displayImages = product ? [getProductImage(product)] : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/details/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch product");
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch all products for similarity comparisons
  useEffect(() => {
    const fetchAllProducts = async () => {
      if (products && products.length > 0) {
        setAllProducts(products);
      } else {
        try {
          const res = await fetch("/api/products/all", { credentials: "include" });
          const data = await res.json();
          if (res.ok) setAllProducts(data);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchAllProducts();
  }, [products]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      toast.success("Product added to cart!");
    }
  };

  const handleRemoveFromCart = () => {
    if (product) {
      dispatch(removeFromCart(product._id));
      toast.success("Product removed from cart!");
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate("/place-order", { state: { product: { ...product, quantity } } });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="text-center py-40 text-gray-500 font-medium">Loading product details...</div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="text-center text-red-500 py-40 font-medium">Error: {error}</div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="text-center text-red-500 py-40 font-medium">Product not found</div>
      <Footer />
    </div>
  );

  // Specifications calculation
  const specs = getProductSpecs(product);

  // Similar products calculation
  const similarProducts = allProducts
    ?.filter((item) => item.category === product.category && item._id !== product._id)
    .slice(0, 4);

  let displaySimilar = similarProducts;
  if (!displaySimilar || displaySimilar.length === 0) {
    displaySimilar = allProducts?.filter((item) => item._id !== product._id).slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Global Header */}
      <Header />

      {/* Main Details Section */}
      <main className="w-full bg-white pb-20 pt-20 md:pt-36">
        
        {/* Breadcrumbs */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 pt-6 text-xs text-gray-500 flex flex-wrap items-center gap-1.5 capitalize">
          <Link to="/" className="hover:text-gray-900 transition">Electronics</Link>
          <span>/</span>
          <span className="hover:text-gray-900 transition">Audio</span>
          <span>/</span>
          <span className="hover:text-gray-900 transition">{product.category || "Headphones"}</span>
          <span>/</span>
          <span className="hover:text-gray-900 transition">Shop {product.category || "Headphones"} by type</span>
          <span>/</span>
          <span className="text-gray-900 font-bold">{product.name?.toLowerCase().replace(/\s+/g, "-")}</span>
        </div>

        {/* Product Details Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column: Product Image Gallery */}
          <div className="flex flex-col">
            {/* Main Preview */}
            <div className="w-full bg-[#f5f6f6] rounded-3xl p-6 sm:p-12 flex items-center justify-center h-[340px] sm:h-[480px]">
              <img
                src={displayImages && displayImages[selectedImageIndex] ? displayImages[selectedImageIndex] : "https://via.placeholder.com/400"}
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Thumbnail Selectors */}
            {displayImages && displayImages.length > 1 && (
              <div className="flex flex-wrap gap-4 mt-6">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 bg-[#f5f6f6] rounded-2xl p-2 flex items-center justify-center transition border-2 cursor-pointer ${
                      selectedImageIndex === i ? "border-[#003d29]" : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchase Options */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 capitalize leading-tight">
              {product.name}
            </h1>
            
            {/* Description */}
            <p className="text-gray-500 mt-4 text-sm sm:text-base leading-relaxed break-words">
              {product.description || "No description available for this product."}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 mt-4">
              <div className="flex text-green-600 text-sm tracking-tighter">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">({product.reviews?.length || 121})</span>
            </div>

            {/* Price section */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Rs. {Number(product.discountPrice || product.originalPrice || 0).toLocaleString()} or Rs. {Math.round((product.discountPrice || product.originalPrice || 0) / 6).toLocaleString()}/month
              </div>
              <div className="text-xs text-gray-400 mt-1.5">
                Suggested payments with 6 months special financing
              </div>
            </div>

            {/* Color selection */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="font-bold text-sm text-gray-900">Choose a Color</h3>
              <div className="flex gap-3 mt-3">
                {[
                  { color: "#ea580c", label: "Orange" },
                  { color: "#374151", label: "Dark Gray" },
                  { color: "#bbf7d0", label: "Mint Green" },
                  { color: "#e5e7eb", label: "Light Gray" },
                  { color: "#1d4ed8", label: "Blue" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(item.label)}
                    style={{ backgroundColor: item.color }}
                    className={`w-8 h-8 rounded-full border-2 transition cursor-pointer ${
                      selectedColor === item.label ? "border-[#003d29] ring-2 ring-[#003d29]/20 scale-110" : "border-white shadow-sm hover:scale-105"
                    }`}
                    title={item.label}
                  />
                ))}
              </div>
            </div>

            {/* Quantity selection & stock warning */}
            <div className="mt-8 border-t border-gray-100 pt-6 flex flex-wrap items-center gap-6">
              {/* Pill counter */}
              <div className="flex items-center bg-[#f5f6f6] rounded-full px-4 py-2.5 gap-6 select-none">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="text-gray-500 hover:text-gray-950 font-extrabold text-lg cursor-pointer transition"
                >
                  −
                </button>
                <span className="font-bold text-sm text-gray-800 w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.min(product.stock || 99, prev + 1))}
                  className="text-gray-500 hover:text-gray-950 font-extrabold text-lg cursor-pointer transition"
                >
                  +
                </button>
              </div>
              
              {/* Stock warning status */}
              <div className="text-xs">
                <span className="text-orange-600 font-bold block">Only {product.stock || 12} Items Left!</span>
                <span className="text-gray-400">Don't miss it</span>
              </div>
            </div>

            {/* Purchase & Add to Cart buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 min-w-[150px] bg-[#003d29] hover:bg-[#002e1f] text-white font-bold py-3.5 px-8 rounded-full transition shadow-sm cursor-pointer text-center text-sm sm:text-base"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                className={`flex-1 min-w-[150px] font-bold py-3.5 px-8 rounded-full transition border text-center text-sm sm:text-base cursor-pointer ${
                  isInCart 
                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" 
                    : "bg-white text-[#003d29] border-[#003d29] hover:bg-[#f5f6f6]"
                }`}
              >
                {isInCart ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>

            {/* Shipping & Return Details Box */}
            <div className="mt-8 border border-gray-150 rounded-2xl divide-y divide-gray-150 overflow-hidden">
              {/* Delivery info */}
              <div className="p-4 flex items-start gap-3">
                <span className="text-orange-500 text-lg mt-0.5">🚚</span>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Free Delivery</h4>
                  <button className="text-xs text-gray-500 underline mt-0.5 hover:text-gray-900 transition block text-left">
                    Enter your Postal code for Delivery Availability
                  </button>
                </div>
              </div>
              {/* Return info */}
              <div className="p-4 flex items-start gap-3">
                <span className="text-orange-500 text-lg mt-0.5">🔄</span>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Return Delivery</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Free 30days Delivery Returns. <button className="underline hover:text-gray-900 transition">Details</button>
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Specifications Section */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-16 border-t border-gray-150 pt-12">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 capitalize">
            {product.name} Full Specifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* General specs container */}
            <div className="bg-[#f5f6f6] rounded-3xl p-6 sm:p-8">
              <h4 className="font-extrabold text-lg text-gray-900 mb-6">General</h4>
              <div className="flex flex-col gap-3">
                {specs.general.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center bg-white py-3.5 px-5 rounded-xl shadow-sm text-sm">
                    <span className="text-gray-400 font-medium">{spec.label}</span>
                    <span className="text-gray-900 font-bold text-right ml-4">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product details specs container */}
            <div className="bg-[#f5f6f6] rounded-3xl p-6 sm:p-8">
              <h4 className="font-extrabold text-lg text-gray-900 mb-6">Product details</h4>
              <div className="flex flex-col gap-3">
                {specs.details.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center bg-white py-3.5 px-5 rounded-xl shadow-sm text-sm">
                    <span className="text-gray-400 font-medium">{spec.label}</span>
                    <span className="text-gray-900 font-bold text-right ml-4">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Similar Items You Might Like Section */}
        {displaySimilar && displaySimilar.length > 0 && (
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-20 border-t border-gray-150 pt-12">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              Similar Items You Might Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displaySimilar.map((item, idx) => (
                <ProductCard key={idx} data={item} />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default ProductDetails;