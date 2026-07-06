import { Link } from "react-router-dom";
import { IoMdStar } from "react-icons/io";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/reducers/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getProductImage } from "../utils/productImages";

function ProductCard({ data }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const displayImage = getProductImage(data);

  const isInCart = cart.some((item) => item._id === data._id);

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error("Signup to create your account!");
      navigate("/");
      return;
    }
    dispatch(addToCart(data));
    toast.success("Added to cart successfully!");
  };

  const handleRemoveFromCart = () => {
    if (!currentUser) {
      toast.error("Signup to create your account!");
      navigate("/");
      return;
    }
    dispatch(removeFromCart(data._id));
    toast.success("Product removed from cart!");
  };

  const handleOnClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      toast.error("Signup to create your account!");
      navigate("/");
    }
  };

  // Format price as Rs. XX.YY with superscript cents matching the screenshot exactly
  const renderPrice = (price) => {
    const num = Number(price) || 0;
    const formatted = num.toFixed(2);
    const [dollars, cents] = formatted.split(".");
    return (
      <span className="font-bold text-gray-900 text-sm sm:text-base">
        Rs. {Number(dollars).toLocaleString()}
        <span className="text-[10px] sm:text-xs align-super font-bold">.{cents}</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-white p-2 rounded-3xl transition-all duration-300">
      <Link onClick={handleOnClick} to={`/product/${data._id}`} className="block group">
        {/* Rounded gray background for the image */}
        <div className="relative bg-[#f5f6f6] rounded-3xl p-6 flex items-center justify-center h-48 sm:h-52 overflow-hidden">
          <img
            src={displayImage}
            alt={data.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {/* Wishlist Heart Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success("Added to wishlist!");
            }}
            className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm hover:scale-110 transition duration-200 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-gray-500 hover:text-red-500 hover:fill-red-500 transition" />
          </button>
        </div>

        {/* Title & Price Row */}
        <div className="flex justify-between items-start gap-2 mt-3 px-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
            {data.name}
          </h2>
          <div className="shrink-0 mt-0.5">
            {renderPrice(data.discountPrice)}
          </div>
        </div>

        {/* Small Grey Subtext Description */}
        <p className="text-xs text-gray-400 font-normal line-clamp-1 mt-1 px-1">
          {data.description || "Organic Cotton, fairtrade certified"}
        </p>

        {/* Ratings and Review Count */}
        <div className="flex items-center gap-1 mt-1.5 px-1">
          <div className="flex gap-0.5 text-green-600">
            {[...Array(5)].map((_, i) => (
              <IoMdStar
                key={i}
                className={i < Math.round(data.ratings || 4) ? "text-[#16a34a]" : "text-gray-300"}
                size={15}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            ({data.ratingsCount || 121})
          </span>
        </div>
      </Link>

      {/* Outlined Add to Cart Button */}
      <div className="mt-3 px-1">
        {isInCart ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveFromCart();
            }}
            className="border border-[#003d29] bg-[#003d29] text-white hover:bg-white hover:text-[#003d29] transition-colors duration-300 font-semibold text-xs px-4 py-1.5 rounded-full cursor-pointer"
          >
            Add to Cart
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className="border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 font-semibold text-xs px-4 py-1.5 rounded-full cursor-pointer"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;