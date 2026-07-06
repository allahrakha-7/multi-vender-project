import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ChevronDown, SlidersHorizontal, ChevronRight } from "lucide-react";
import {
  fetchOtherUsersProductsStart,
  fetchOtherUsersProductsSuccess,
  fetchOtherUsersProductsFailure,
} from "../redux/reducers/productSlice";
import ProductCard from "../components/ProductCard";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ecomSideImage from "../images/ecom-side-image.png";

const PRODUCTS_PER_PAGE = 8;

function ProductsPage() {
  const { products, loading } = useSelector((state) => state.product);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  // Filter States
  const [sortType, setSortType] = useState("default");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Sync search term and sort parameter with URL search parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    const sortParam = params.get("sort");
    if (sortParam) {
      setSortType(sortParam);
    } else {
      setSortType("default");
    }
  }, [location.search]);

  // Reset pagination to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPriceRange, selectedRating, selectedType, selectedColor, sortType]);

  // Click outside to close active filter dropdowns
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(fetchOtherUsersProductsStart());
        const res = await fetch("/api/products/all", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch products");

        dispatch(fetchOtherUsersProductsSuccess(data));
      } catch (error) {
        dispatch(fetchOtherUsersProductsFailure(error.message));
      }
    };

    fetchProducts();
  }, [dispatch]);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setSelectedType(null);
    setSelectedColor(null);
    setSortType("default");
    setActiveDropdown(null);
  };

  // Perform dynamic filtering and sorting in real-time
  const filteredProducts = products
    ?.filter((item) => !currentUser || item.seller !== currentUser._id)
    .filter((item) => {
      // 1. Search term filter
      const matchesSearch = !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      // 2. Price filter
      let matchesPrice = true;
      if (selectedPriceRange) {
        const price = item.discountPrice || item.originalPrice || 0;
        matchesPrice = price >= selectedPriceRange[0] && price <= selectedPriceRange[1];
      }

      // 3. Rating filter
      let matchesRating = true;
      if (selectedRating) {
        matchesRating = (item.ratings || 0) >= selectedRating;
      }

      // 4. Product Type filter
      let matchesType = true;
      if (selectedType) {
        matchesType = item.category?.toLowerCase() === selectedType.toLowerCase() ||
          (item.tags && item.tags.some(tag => tag.toLowerCase() === selectedType.toLowerCase()));
      }

      // 5. Color filter
      let matchesColor = true;
      if (selectedColor) {
        matchesColor = item.tags && item.tags.some(tag => tag.toLowerCase() === selectedColor.toLowerCase());
      }

      return matchesSearch && matchesPrice && matchesRating && matchesType && matchesColor;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortType === "priceLowToHigh") {
        return (a.discountPrice || 0) - (b.discountPrice || 0);
      }
      if (sortType === "priceHighToLow") {
        return (b.discountPrice || 0) - (a.discountPrice || 0);
      }
      if (sortType === "topRated") {
        return (b.ratings || 0) - (a.ratings || 0);
      }
      if (sortType === "newest") {
        const dateA = a.createdAt ? new Date(a.createdAt) : 0;
        const dateB = b.createdAt ? new Date(b.createdAt) : 0;
        if (dateA && dateB) {
          return dateB - dateA;
        }
        return b._id.toString().localeCompare(a._id.toString());
      }
      return 0;
    });

  // Pagination Calculations
  const totalPages = Math.ceil((filteredProducts?.length || 0) / PRODUCTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts?.slice(startIndex, startIndex + PRODUCTS_PER_PAGE) || [];

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Dynamically change heading title based on active search
  const headingTitle = searchTerm
    ? `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} For You!`
    : "Products For You!";

  return (
    <div className="min-h-screen bg-white">
      {/* Universal Header */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full bg-white pb-16 pt-20 md:pt-36">

        {/* Promotional Headphone Banner */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-6">
          <div className="relative rounded-3xl bg-[#f6f3ed] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center overflow-hidden h-[240px] md:h-[280px]">
            <div className="flex flex-col gap-4 text-left z-10 md:w-3/5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#003d29] leading-tight capitalize">
                Grab Upto 50% Off On Selected {searchTerm || selectedType || "Products"}
              </h1>
              <div>
                <button className="bg-[#003d29] hover:bg-[#002e1f] text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-sm text-sm cursor-pointer">
                  Buy Now
                </button>
              </div>
            </div>
            {/* Right side portrait image */}
            <div className="absolute right-8 bottom-0 top-2 h-full w-full md:w-2/5 flex items-end justify-end pointer-events-none z-0">
              <img
                src={ecomSideImage}
                alt="Promotional Banner"
                className="h-[90%] md:h-[110%] object-contain object-bottom select-none mix-blend-multiply opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-700">

            {/* Headphone / Product Type Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === "type" ? null : "type");
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition cursor-pointer text-xs sm:text-sm ${selectedType ? "bg-[#003d29] text-white border border-[#003d29]" : "bg-[#f5f6f6] border border-transparent text-gray-700 hover:bg-[#eef0f0]"
                  }`}
              >
                {selectedType ? `Type: ${selectedType}` : "Product Type"} <ChevronDown size={14} />
              </button>
              {activeDropdown === "type" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2"
                >
                  <button
                    onClick={() => { setSelectedType(null); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    All Types
                  </button>
                  {["Electronics", "Books", "Furniture", "Fashion", "Beauty"].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setSelectedType(type); setActiveDropdown(null); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === "price" ? null : "price");
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition cursor-pointer text-xs sm:text-sm ${selectedPriceRange ? "bg-[#003d29] text-white border border-[#003d29]" : "bg-[#f5f6f6] border border-transparent text-gray-700 hover:bg-[#eef0f0]"
                  }`}
              >
                {selectedPriceRange ? `Price: Rs. ${selectedPriceRange[0].toLocaleString()}-${selectedPriceRange[1] === 999999 ? "+" : selectedPriceRange[1].toLocaleString()}` : "Price"} <ChevronDown size={14} />
              </button>
              {activeDropdown === "price" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2"
                >
                  <button
                    onClick={() => { setSelectedPriceRange(null); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    All Prices
                  </button>
                  {[
                    { label: "Under Rs. 5,000", val: [0, 5000] },
                    { label: "Rs. 5,000 to Rs. 20,000", val: [5000, 20000] },
                    { label: "Rs. 20,000 to Rs. 100,000", val: [20000, 100000] },
                    { label: "Over Rs. 100,000", val: [100000, 999999] }
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => { setSelectedPriceRange(range.val); setActiveDropdown(null); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Review Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === "review" ? null : "review");
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition cursor-pointer text-xs sm:text-sm ${selectedRating ? "bg-[#003d29] text-white border border-[#003d29]" : "bg-[#f5f6f6] border border-transparent text-gray-700 hover:bg-[#eef0f0]"
                  }`}
              >
                {selectedRating ? `Rating: ${selectedRating}★+` : "Review"} <ChevronDown size={14} />
              </button>
              {activeDropdown === "review" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2"
                >
                  <button
                    onClick={() => { setSelectedRating(null); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    All Ratings
                  </button>
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => { setSelectedRating(stars); setActiveDropdown(null); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                    >
                      {stars} Stars & Up
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === "color" ? null : "color");
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition cursor-pointer text-xs sm:text-sm ${selectedColor ? "bg-[#003d29] text-white border border-[#003d29]" : "bg-[#f5f6f6] border border-transparent text-gray-700 hover:bg-[#eef0f0]"
                  }`}
              >
                {selectedColor ? `Color: ${selectedColor}` : "Color"} <ChevronDown size={14} />
              </button>
              {activeDropdown === "color" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2"
                >
                  <button
                    onClick={() => { setSelectedColor(null); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                  >
                    All Colors
                  </button>
                  {["Black", "Red", "Blue", "White", "Pink"].map((color) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setActiveDropdown(null); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear All / All Filters Button */}
            {(selectedPriceRange || selectedRating || selectedType || selectedColor || sortType !== "default") && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 transition px-4 py-2 rounded-full font-medium text-xs sm:text-sm cursor-pointer"
              >
                Clear Filters <SlidersHorizontal size={14} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === "sort" ? null : "sort");
              }}
              className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 transition px-4 py-2 rounded-full font-medium text-xs sm:text-sm cursor-pointer text-gray-700"
            >
              Sort by: {
                sortType === "priceLowToHigh" ? "Price: Low to High" :
                  sortType === "priceHighToLow" ? "Price: High to Low" :
                    sortType === "topRated" ? "Top Rated" :
                      sortType === "newest" ? "Newest Arrivals" :
                        "Default"
              } <ChevronDown size={14} className="text-gray-500" />
            </button>
            {activeDropdown === "sort" && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2"
              >
                <button
                  onClick={() => { setSortType("default"); setActiveDropdown(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  Default
                </button>
                <button
                  onClick={() => { setSortType("priceLowToHigh"); setActiveDropdown(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => { setSortType("priceHighToLow"); setActiveDropdown(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => { setSortType("topRated"); setActiveDropdown(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  Top Rated
                </button>
                <button
                  onClick={() => { setSortType("newest"); setActiveDropdown(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  Newest Arrivals
                </button>
              </div>
            )}
          </div>

        </div>



        {/* Section Title */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {headingTitle}
          </h2>
        </div>

        {/* Product Grid */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="col-span-full text-center text-gray-400 py-12">Loading products...</p>
            ) : paginatedProducts && paginatedProducts.length > 0 ? (
              paginatedProducts.map((item, idx) => (
                <ProductCard key={idx} data={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-red-500 py-12 font-medium">No products found matching filters</p>
            )}
          </div>
        </div>

        {/* Dynamic Pagination Bar (Centered at the bottom of the grid as well for easy access) */}
        {totalPages > 1 && (
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mt-12 flex justify-center items-center gap-2">
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${currentPage === num
                  ? "bg-[#003d29] text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {num}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}

export default ProductsPage;