import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();

  const brandingData = [
    {
      id: 1,
      title: "Free Shipping",
      Description: "From all orders over 100$",
      icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1H5.63636V24.1818H35"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
          <path
            d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
          <path
            d="M31.9073 35.0002C33.6144 35.0002 34.9982 33.6163 34.9982 31.9093C34.9982 30.2022 33.6144 28.8184 31.9073 28.8184C30.2003 28.8184 28.8164 30.2022 28.8164 31.9093C28.8164 33.6163 30.2003 35.0002 31.9073 35.0002Z"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
          <path
            d="M34.9982 1H11.8164V18H34.9982V1Z"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
          <path
            d="M11.8164 7.18164H34.9982"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Daily Surprise Offers",
      Description: "Save up to 25% off",
      icon: (
        <svg
          width="32"
          height="34"
          viewBox="0 0 32 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
          ></path>
          <path
            d="M30.7 2L29.5 10.85L20.5 9.65"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
        </svg>
      ),
    },
    {
      id: 4,
      title: "Affordable Prices",
      Description: "Get Factory direct price",
      icon: (
        <svg
          width="32"
          height="35"
          viewBox="0 0 32 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 13H5.5C2.95 13 1 11.05 1 8.5V1H7"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
          ></path>
          <path
            d="M25 13H26.5C29.05 13 31 11.05 31 8.5V1H25"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
          ></path>
          <path
            d="M16 28V22"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
          ></path>
          <path
            d="M16 22C11.05 22 7 17.95 7 13V1H25V13C25 17.95 20.95 22 16 22Z"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
          <path
            d="M25 34H7C7 30.7 9.7 28 13 28H19C22.3 28 25 30.7 25 34Z"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
        </svg>
      ),
    },
    {
      id: 5,
      title: "Secure Payments",
      Description: "100% protected payments",
      icon: (
        <svg
          width="32"
          height="38"
          viewBox="0 0 32 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
          <path
            d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
          <path
            d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
            stroke="#FFBB38"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          ></path>
        </svg>
      ),
    },
  ];

  const categoryData = [
    {
      id: 1,
      title: "Furniture",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "Hand Bag",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "Books",
      image: "https://images-na.ssl-images-amazon.com/images/I/71g2ednj0JL.jpg",
    },
    {
      id: 4,
      title: "Tech",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      title: "Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 6,
      title: "Travel",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const handleCategorySelect = (categoryTitle) => {
    navigate(`/products?search=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <>
      {/* Top Categories Section */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-[#003d29] mb-6 sm:mb-8 text-center sm:text-left">
          Shop Our Top Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categoryData.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl h-52 sm:h-60 flex flex-col items-center justify-start pt-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              onClick={() => handleCategorySelect(category.title)}
            >
              {/* Image as background */}
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Semi-transparent Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              
              {/* White Text on top of Image */}
              <span className="relative text-white font-bold text-base sm:text-lg tracking-wide z-10 text-center px-3 select-none">
                {category.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Branding bar (hidden on mobile) */}
      <div className="w-full max-w-7xl mx-auto hidden sm:block px-4 lg:px-8 mb-8 sm:mb-12">
        <div
          className="flex flex-wrap items-center justify-between gap-6 w-full bg-white p-6 rounded-xl border border-gray-100/80 shadow-sm"
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-center gap-4" key={index}>
                <div className="shrink-0">
                  {i.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-gray-800 leading-tight">{i.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Categories;