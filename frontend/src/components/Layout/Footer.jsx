import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";

function Footer() {
  const footercompanyLinks = [
    {
      name: "Game & Video",
      link: "/gamesandvideos"
    },
    {
      name: "Phone & Tablets",
      link: "/phonesandtablets"
    },
    {
      name: "Computers & Laptop",
      link: "/computersandlaptops"
    },
    {
      name: "Sport Watches",
      link: "/watches"
    },
    {
      name: "Events",
      link: "/events"
    },
  ];

  const footerSupportLinks = [
    {
      name: "FAQs",
      link: "/faqs"
    },
    {
      name: "Reviews",
      link: "/reviews-support"
    },
    {
      name: "Contact Us",
      link: "/contact-us"
    },
    {
      name: "Shipping",
      link: "/shipping"
    },
    {
      name: "Live chat",
      link: "/chat"
    },
  ];

  const footerProductLinks = [
    {
      name: "About us",
      link: "/about-us"
    },
    {
      name: "Careers",
      link: "/careers"
    },
    {
      name: "Store Locations",
      link: "/stores"
    },
    {
      name: "Our Blog",
      link: "/blogs"
    },
    {
      name: "Reviews",
      link: "/reviews"
    },
  ];

  return (
    <div className="bg-white text-gray-800 border-t border-gray-100">
      {/* Stay Connected Banner */}
      <div className="bg-gradient-to-r from-[#003d29] to-[#002e1f] py-12">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 md:flex md:justify-between md:items-center">
          <h1 className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-bold md:w-2/5 text-white">
            <span className="text-[#f97316]">Stay Connected</span> with Shopcart{" "}
            <br />
            <span className="text-lg font-normal text-gray-200">Get exclusive deals, new arrivals & special offers!</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="sm:w-80 bg-white/10 placeholder-white/60 text-white border border-white/20 w-full py-3 px-5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <button className="bg-white text-[#003d29] font-semibold hover:bg-gray-100 duration-300 px-8 py-3 rounded-full shadow-sm hover:scale-105 transition-all text-sm cursor-pointer">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <ul className="text-center sm:text-start flex sm:block flex-col items-center sm:items-start">
          <div className="flex items-center gap-2 font-sans mb-4 select-none">
            <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 12 25 L 24 25 L 38 75 L 82 75 L 94 38 L 30 38"
                stroke="#0c513f"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 94 38 L 97 34"
                stroke="#0c513f"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="44" cy="86" r="8" fill="#0c513f" />
              <circle cx="44" cy="86" r="3" fill="#fff" />
              <circle cx="76" cy="86" r="8" fill="#0c513f" />
              <circle cx="76" cy="86" r="3" fill="#fff" />
              <path
                d="M 50 42 C 50 42, 72 42, 72 42 C 68 58, 60 70, 60 70 C 60 70, 52 58, 50 42 Z"
                fill="#f97316"
              />
              <path d="M 54 48 Q 61 50 68 48" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
              <path d="M 56 56 Q 61 58 66 56" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M 54 36 C 54 24, 61 20, 61 20 C 61 20, 68 24, 68 36 Z"
                fill="#22c55e"
              />
              <path d="M 61 32 L 61 20" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[32px] font-black text-[#0c513f] tracking-tight">Shopcart</span>
          </div>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed max-w-xs">
            Your ultimate shopping destination. Bringing quality products, unbeatable prices, and exceptional service right to your doorstep.
          </p>
          <div className="flex items-center gap-4">
            <AiFillFacebook 
              size={24} 
              className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform" 
            />
            <AiOutlineTwitter
              size={24}
              className="cursor-pointer text-gray-400 hover:text-black transition-colors duration-300 hover:scale-110 transform"
            />
            <AiFillInstagram
              size={24}
              className="cursor-pointer text-gray-400 hover:text-[#e1306c] transition-colors duration-300 hover:scale-110 transform"
            />
            <AiFillYoutube
              size={24}
              className="cursor-pointer text-gray-400 hover:text-red-600 transition-colors duration-300 hover:scale-110 transform"
            />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h2 className="mb-6 font-bold text-sm uppercase tracking-wider text-[#003d29] border-b border-gray-100 pb-2">Company</h2>
          {footerProductLinks.map((link, index) => (
            <li key={index} className="mb-3">
              <Link
                className="text-gray-500 hover:text-[#003d29] duration-300 text-sm cursor-pointer leading-6 transition-all"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h2 className="mb-6 font-bold text-sm uppercase tracking-wider text-[#003d29] border-b border-gray-100 pb-2">Shop</h2>
          {footercompanyLinks.map((link, index) => (
            <li key={index} className="mb-3">
              <Link
                className="text-gray-500 hover:text-[#003d29] duration-300 text-sm cursor-pointer leading-6 transition-all"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h2 className="mb-6 font-bold text-sm uppercase tracking-wider text-[#003d29] border-b border-gray-100 pb-2">Support</h2>
          {footerSupportLinks.map((link, index) => (
            <li key={index} className="mb-3">
              <Link
                className="text-gray-500 hover:text-[#003d29] duration-300 text-sm cursor-pointer leading-6 transition-all"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-50/50 border-t border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 md:flex md:items-center md:justify-between text-gray-500 text-sm text-center md:text-left gap-4">
          <span className="font-medium">© 2026 Shopcart. All rights are reserved.</span>
          <div className="flex justify-center gap-4 my-4 md:my-0">
            <Link to="/terms" className="hover:text-[#003d29] transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-[#003d29] transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <img
              src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
              alt="Payment Methods"
              className="h-6 object-contain filter brightness-95"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;