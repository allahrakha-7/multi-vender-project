import { Link } from "react-router-dom";
import hero_image from "../../images/hero_image.png";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Hero() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleOnClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      toast.error("Signup to create your account!");
      navigate("/sign-up");
    }
  };

  return (
    <div
      className="relative max-sm:min-h-[85vh] min-h-[70vh] mt-[70px] md:mt-[100px] mb-6 sm:min-h-[80vh] lg:min-h-[90vh] w-full bg-no-repeat flex items-center justify-center sm:justify-start"
      style={{
        backgroundImage: `url(${hero_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-11/12 max-sm:mt-4 xl:w-1/2 text-center sm:text-left px-3 sm:px-8">
        <h1 className="text-2xl text-[#003d29] sm:text-3xl md:text-4xl lg:text-3xl xl:text-5xl font-bold leading-tight sm:leading-[1.2] capitalize">
          Smart Shopping,<br />Delivered to Your Doorstep
        </h1>

        <p className="pt-6 mb-6 sm:pt-5 font-normal text-base sm:text-lg lg:text-xl text-[#003d29] leading-relaxed sm:leading-8">
          Explore thousands of premium products curated just for you,<br /> from daily essentials to high-end tech and fashion, Shopcart offers seamless transactions, secure checkout, and ultra-fast delivery. Sign up today and experience the future of retail.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 my-4 sm:my-2">
          <Link onClick={handleOnClick} to="/products" className="inline-block">
            <div className="px-5 py-2 sm:px-6 sm:py-2.5 bg-[#f97316] hover:bg-[#ea580c] flex items-center justify-center rounded-full cursor-pointer transition-all duration-300">
              <span className="text-sm sm:text-base font-medium text-white">
                Shop Now
              </span>
            </div>
          </Link>

          <Link to="/about" className="inline-block">
            <div className="px-5 py-2 sm:px-6 sm:py-2.5 bg-[#f97316] hover:bg-[#ea580c] flex items-center justify-center rounded-full cursor-pointer transition-all duration-300">
              <span className="text-sm sm:text-base font-medium text-white">
                Learn more
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
