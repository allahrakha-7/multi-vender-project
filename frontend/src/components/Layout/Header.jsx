import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Phone,
  LayoutDashboard,
  LogOut,
  ShoppingBag
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
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

  const handleSwitchRole = async (newRole) => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...currentUser,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || "Failed to switch role"));
        toast.error(data.message || "Failed to switch role");
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success(`Switched to ${newRole === "seller" ? "Seller" : "Customer"} account successfully!`);
      if (newRole === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message || "Something went wrong!");
    }
  };

  const renderAvatar = (user, sizeClass = "w-9 h-9 text-sm") => {
    if (user?.avatar && user.avatar !== "" && user.avatar !== "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png") {
      return (
        <img
          src={user.avatar}
          alt="profile"
          className={`${sizeClass.split(" ")[0]} ${sizeClass.split(" ")[1]} rounded-full object-cover border border-gray-200`}
        />
      );
    }
    
    const firstChar = user?.username ? user.username.charAt(0).toUpperCase() : "?";
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-600", "bg-yellow-500", 
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
    ];
    const charCode = firstChar.charCodeAt(0) || 0;
    const colorClass = colors[charCode % colors.length];
    
    return (
      <div className={`${sizeClass} rounded-full ${colorClass} text-white flex items-center justify-center font-bold uppercase border border-white shadow-sm select-none`}>
        {firstChar}
      </div>
    );
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
                <Link to="/products?sort=newest" className="hover:text-green-600 transition font-normal">
                  What's New
                </Link>

                {/* Delivery */}
                <Link to="/shipping" className="hover:text-green-600 transition font-normal">
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
                      {renderAvatar(currentUser, "w-6 h-6 text-[10px]")}
                      <span className="hidden sm:inline">Account</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${profileOptions ? "rotate-180" : ""}`}
                      />
                    </div>
                    {profileOptions && (
                      <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-150 rounded-xl shadow-xl z-50 py-2 divide-y divide-gray-100 transition duration-200">
                        {/* Profile Summary Card */}
                        <div className="px-4 py-2.5 flex items-center gap-3">
                          {renderAvatar(currentUser, "w-9 h-9 text-xs")}
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-gray-800 truncate">{currentUser.username}</p>
                            <p className="text-[11px] text-gray-500 truncate font-normal">{currentUser.email}</p>
                          </div>
                        </div>

                        {/* Quick Links */}
                        <div className="py-1">
                          {currentUser.role === "seller" ? (
                            <>
                              <Link
                                to="/seller-dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition font-normal"
                                onClick={() => setProfileOptions(false)}
                              >
                                <LayoutDashboard size={15} className="text-gray-500" />
                                <span>Seller Dashboard</span>
                              </Link>
                              <Link
                                to="/seller-orders"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition font-normal"
                                onClick={() => setProfileOptions(false)}
                              >
                                <ShoppingBag size={15} className="text-gray-500" />
                                <span>Seller Orders</span>
                              </Link>
                              <button
                                onClick={() => {
                                  handleSwitchRole("user");
                                  setProfileOptions(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition font-normal text-left cursor-pointer"
                              >
                                <User size={15} className="text-gray-500" />
                                <span>Switch to Customer</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  handleSwitchRole("seller");
                                  setProfileOptions(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition font-normal text-left cursor-pointer"
                              >
                                <LayoutDashboard size={15} className="text-gray-500" />
                                <span>Become a Seller</span>
                              </button>
                            </>
                          )}
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition font-normal"
                            onClick={() => setProfileOptions(false)}
                          >
                            <User size={15} className="text-gray-500" />
                            <span>Edit Profile</span>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleSignOut();
                              setProfileOptions(false);
                            }}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer font-normal"
                          >
                            <LogOut size={15} className="text-red-500" />
                            <span>Sign Out</span>
                          </button>
                        </div>
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
          <div className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white shadow-2xl p-5 flex flex-col z-50 justify-between">
            <div>
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
                  className="absolute right-3.5 text-gray-505 hover:text-green-600 transition"
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

                <Link
                  to="/products"
                  className="block py-2 text-gray-800 font-normal border-b border-gray-50 hover:text-green-600 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Deals
                </Link>

                <Link
                  to="/products?sort=newest"
                  className="block py-2 text-gray-800 font-normal border-b border-gray-50 hover:text-green-600 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  What's New
                </Link>

                <Link
                  to="/shipping"
                  className="block py-2 text-gray-800 font-normal border-b border-gray-50 hover:text-green-600 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Delivery
                </Link>
              </nav>
            </div>

            {/* Mobile Drawer Account Section */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              {currentUser ? (
                <div>
                  <div className="flex items-center gap-3 mb-4 px-2">
                    {renderAvatar(currentUser, "w-10 h-10 text-sm")}
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-800 truncate">{currentUser.username}</p>
                      <p className="text-xs text-gray-500 truncate font-normal">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {currentUser.role === "seller" ? (
                      <>
                        <Link
                          to="/seller-dashboard"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition font-medium"
                          onClick={() => setMobileOpen(false)}
                        >
                          <LayoutDashboard size={16} className="text-gray-500" />
                          <span>Seller Dashboard</span>
                        </Link>
                        <Link
                          to="/seller-orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition font-medium"
                          onClick={() => setMobileOpen(false)}
                        >
                          <ShoppingBag size={16} className="text-gray-500" />
                          <span>Seller Orders</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleSwitchRole("user");
                            setMobileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition font-medium text-left cursor-pointer"
                        >
                          <User size={16} className="text-gray-500" />
                          <span>Switch to Customer</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          handleSwitchRole("seller");
                          setMobileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition font-medium text-left cursor-pointer"
                      >
                        <LayoutDashboard size={16} className="text-gray-500" />
                        <span>Become a Seller</span>
                      </button>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User size={16} className="text-gray-500" />
                      <span>Edit Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition font-medium cursor-pointer"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-2 pb-2">
                  <Link
                    to="/sign-in"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#003d29] text-white text-sm font-medium rounded-full hover:bg-[#002e1f] transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User size={16} />
                    <span>Sign In / Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;