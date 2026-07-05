import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { LiaShippingFastSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/reducers/userSlice.js";

function SellerHeader() {
  const { currentUser } = useSelector((state) => state.user);
  const { newOrderCount } = useSelector((state) => state.order);
  const [profileOptions, setProfileOptions] = useState(false);
  const profileRef = useRef();
  const dispatch = useDispatch();
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

  const renderAvatar = (user, sizeClass = "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-xs", onClick) => {
    if (user?.avatar && user.avatar !== "" && user.avatar !== "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png") {
      return (
        <img
          src={user.avatar}
          alt="profile"
          className={`${sizeClass.split(" ").slice(0, 5).join(" ")} rounded-full object-cover border border-gray-300 hover:border-gray-400 transition-colors`}
          onClick={onClick}
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
      <div 
        onClick={onClick}
        className={`${sizeClass} rounded-full ${colorClass} text-white flex items-center justify-center font-bold uppercase border border-gray-300 hover:border-gray-400 transition-colors select-none`}
      >
        {firstChar}
      </div>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm px-2 sm:px-4 py-2 sm:py-3 bg-slate-50 shadow-md">
        <div className="flex justify-between items-center gap-2 sm:gap-4 md:gap-8 flex-1 min-w-0 max-w-7xl mx-auto">
          <Link to="/seller-dashboard" className="shrink-0">
            <div className="font-bold flex items-center">
              <MdOutlineShoppingCart className="text-[20px] xs:text-[24px] sm:text-[28px] md:text-[32px] text-gray-700 font-extralight" />
              <div className="flex flex-col ml-1">
                <span className="text-green-600 text-[16px] xs:text-[20px] sm:text-[24px] md:text-[28px] font-semibold font-[Georgia] leading-tight">
                  Vendify
                </span>
                <p className="text-[6px] xs:text-[8px] sm:text-[10px] text-gray-800 ml-1 sm:ml-2 uppercase italic">
                  shop from home
                </p>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center">
            <Link to="/seller-dashboard" className="text-gray-700 text-lg lg:text-xl xl:text-2xl font-semibold relative">
              Seller Dashboard
              <span className="absolute -top-1 -right-23 lg:-right-30 shadow-white shadow-sm text-xs lg:text-sm px-1 lg:px-3 py-1 lg:py-1.5 rounded-full text-red-500 font-medium bg-white border border-red-200">
                Seller Account
              </span>
            </Link>
          </nav>

          <div className="flex-1 md:hidden text-center">
            <h1 className="text-gray-700 text-sm xs:text-base sm:text-lg font-semibold">
              Seller Dashboard
            </h1>
            <span className="text-[10px] xs:text-xs text-red-500 font-medium">
              Seller Account
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 relative" ref={profileRef}>
            <Link to='/seller-orders'>
              <LiaShippingFastSolid size={28} />
              {newOrderCount > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-red-500 w-3 h-3 flex items-center justify-center text-[10px] text-white font-mono leading-tight">
                  •
                </span>
              )}
            </Link>
            <div className="relative cursor-pointer">
              {renderAvatar(currentUser, "w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-xs", () => setProfileOptions((prev) => !prev))}
              {profileOptions && (
                <div className="absolute right-0 mt-2 w-32 xs:w-36 sm:w-40 font-semibold bg-white border border-gray-250 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      handleSwitchRole("user");
                      setProfileOptions(false);
                    }}
                    className="w-full block px-3 sm:px-4 py-2 sm:py-3 text-center text-xs xs:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Switch to User
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default SellerHeader;