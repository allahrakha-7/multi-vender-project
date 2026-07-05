import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Phone
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../../redux/reducers/userSlice.js";

// Inline SVG Logo for Shopcart (shopping cart with green frame/wheels, orange carrot, green leaves)
const Logo = ({ size = "34" }) => (
  <div className="flex items-center gap-2 font-sans select-none">
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chassis / Handle in Forest Green */}
      <path
        d="M 12 25 L 24 25 L 38 75 L 82 75 L 94 38 L 30 38"
        stroke="#0c513f"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Front lip handle */}
      <path
        d="M 94 38 L 97 34"
        stroke="#0c513f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Wheels */}
      <circle cx="44" cy="86" r="8" fill="#0c513f" />
      <circle cx="44" cy="86" r="3" fill="#fff" />
      <circle cx="76" cy="86" r="8" fill="#0c513f" />
      <circle cx="76" cy="86" r="3" fill="#fff" />

      {/* Carrot body (Orange) */}
      <path
        d="M 50 42 C 50 42, 72 42, 72 42 C 68 58, 60 70, 60 70 C 60 70, 52 58, 50 42 Z"
        fill="#f97316"
      />
      {/* Carrot lines */}
      <path d="M 54 48 Q 61 50 68 48" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      <path d="M 56 56 Q 61 58 66 56" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />

      {/* Leaf / Carrot Top (Green) */}
      <path
        d="M 54 36 C 54 24, 61 20, 61 20 C 61 20, 68 24, 68 36 Z"
        fill="#22c55e"
      />
      <path d="M 61 32 L 61 20" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <span className="text-2xl font-bold text-[#0c513f] tracking-tight">Shopcart</span>
  </div>
);

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [profileOptions, setProfileOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const categories = [
    "Personal Care",
    "Household Items",
    "Health & Medicine",
    "Entertainment",
    "Decorations",
    "Electronics",
    "Stationery and Bags",
    "Others",
  ];

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const data = await fetch("/api/auth/sign-out", {
        method: "GET",
        credentials: "include",
      });
      const result = await data.json();
      console.log("Response status:", data.status, "Response:", result);
      if (!data.ok) {
        dispatch(signOutUserFailure(result.message || "Server error"));
        toast.error(result.message || "Something went wrong!");
        return;
      }
      dispatch(signOutUserSuccess(result));
      toast.success(result || "Signed Out Successfully!");
      navigate("sign-in");
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch(signOutUserFailure(error.message));
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleCategorySelect = (category) => {
    setSearchTerm(category);
    navigate(`/products?search=${encodeURIComponent(category)}`);
    setIsCategoryOpen(false);
    setMobileCategoriesOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-[#0c513f]/10">
        {/* Top bar (Hidden on mobile) */}
        <div className="bg-[#003d29] text-white text-xs py-2 hidden md:block border-b border-[#002e1f]">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-2">
            {/* Left: Phone */}
            <div className="flex items-center gap-2">
              <Phone size={13} />
              <span>+92 301 8082787</span>
            </div>

            {/* Center: Promo */}
            <div className="flex items-center gap-1 font-medium">
              <span>Get 50% Off on Selected Items</span>
              <span className="text-gray-400">|</span>
              <Link to="/products" className="underline hover:text-green-200 transition">
                Shop Now
              </Link>
            </div>

            {/* Right: Language and Location */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200 transition">
                <span>Eng</span>
                <ChevronDown size={14} />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200 transition">
                <span>Location</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="w-full">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 lg:px-8 py-3">
            {/* Left side: Mobile Hamburger menu + Logo + Desktop Menu items */}
            <div className="flex items-center gap-6 lg:gap-14 xl:gap-18 shrink-0">
              <button
                type="button"
                className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-700"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={24} />
              </button>

              <Link to="/" className="shrink-0">
                <Logo />
              </Link>

              {/* Desktop Nav Items (Categories dropdown + Deals + What's New + Delivery) */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-gray-700 text-sm lg:text-base">
                {/* Categories Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-green-600 transition cursor-pointer py-2 font-normal"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
                      size={16}
                    />
                  </button>
                  <div
                    className={`absolute left-0 mt-1 w-56 bg-white border border-gray-100 shadow-lg rounded-md transition-all duration-200 ease-in-out z-50 ${isCategoryOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                  >
                    <ul className="py-2 text-gray-700 text-sm max-h-[320px] overflow-y-auto">
                      {categories.map((category, index) => (
                        <li
                          key={index}
                          className="px-4 py-1.5 hover:bg-gray-50 hover:text-green-600 cursor-pointer transition"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Deals */}
                <Link to="/products" className="hover:text-green-600 transition font-normal">
                  Deals
                </Link>

                {/* What's New */}
                <Link to="/products" className="hover:text-green-600 transition font-normal">
                  What's New
                </Link>

                {/* Delivery */}
                <Link to="/products" className="hover:text-green-600 transition font-normal">
                  Delivery
                </Link>
              </nav>
            </div>

            {/* Right side: Search bar & Actions */}
            <div className="flex items-center gap-4 lg:gap-6 ml-auto flex-1 justify-end">
              {/* Search Bar (Desktop) */}
              <div className="hidden md:block w-48 lg:w-56 xl:w-64">
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search Product"
                    className="bg-[#f5f6f8] hover:bg-[#ebecf0] focus:bg-white border border-transparent focus:border-gray-250 w-full pl-4 pr-10 py-1.5 text-sm rounded-full focus:outline-none transition duration-200 text-gray-800 placeholder-gray-500 font-sans"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition cursor-pointer"
                  >
                    <Search size={15} />
                  </button>
                </form>
              </div>

              {/* Actions: Account & Cart */}
              <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                {/* Account */}
                {currentUser ? (
                  <div className="relative" ref={profileRef}>
                    <div
                      onClick={() => setProfileOptions((prev) => !prev)}
                      className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600 transition font-normal text-sm lg:text-base py-2"
                    >
                      <img
                        src={currentUser.avatar}
                        alt="profile"
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                      />
                      <span className="hidden sm:inline">Account</span>
                    </div>
                    {profileOptions && (
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1 font-semibold">
                        <Link
                          to="/seller-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setProfileOptions(false)}
                        >
                          Switch to Seller
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setProfileOptions(false)}
                        >
                          Edit Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setProfileOptions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/sign-in"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-normal text-sm lg:text-base py-2"
                  >
                    <User size={18} className="text-gray-700" />
                    <span className="hidden sm:inline">Account</span>
                  </Link>
                )}

                {/* Cart */}
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-normal text-sm lg:text-base py-2"
                >
                  <div className="relative flex items-center justify-center">
                    <ShoppingCart size={18} className="text-gray-700" />
                    {cart.length > 0 && (
                      <span className="absolute -right-2 -top-1.5 rounded-full bg-[#00bf63] w-4.5 h-4.5 text-white font-sans text-[10px] font-bold leading-none flex items-center justify-center border border-white">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 md:hidden">
          <div className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white shadow-2xl p-5 overflow-y-auto">
            {/* Header of Drawer */}
            <div className="flex items-center justify-between mb-6">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <Logo size="30" />
              </Link>
              <button
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-6">
              <input
                type="text"
                placeholder="Search Product..."
                className="bg-[#f5f6f8] hover:bg-[#ebecf0] focus:bg-white focus:outline-none flex-1 px-4 py-2 text-sm rounded-full border border-transparent focus:border-gray-300 text-gray-800 placeholder-gray-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3.5 text-gray-500 hover:text-green-600 transition"
              >
                <Search size={14} />
              </button>
            </form>

            {/* Drawer Links */}
            <nav className="space-y-3">
              <Link
                to="/"
                className="block py-2 text-gray-800 font-normal border-b border-gray-50 hover:text-green-600 transition"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>

              {/* Categories Collapse */}
              <div className="border-b border-gray-50 pb-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-2 text-gray-800 font-medium hover:text-green-600 transition"
                  onClick={() => setMobileCategoriesOpen((p) => !p)}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""}`}
                    size={14}
                  />
                </button>
                {mobileCategoriesOpen && (
                  <ul className="pl-3 py-1 space-y-1 bg-gray-50 rounded-md mt-1 max-h-48 overflow-y-auto">
                    {categories.map((category, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-green-600 cursor-pointer rounded transition"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;