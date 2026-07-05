import big from "../../images/big.png";
import amazon from "../../images/amazonlogo.png";
import etsy from "../../images/etsy.png";
import squarespace from "../../images/squarespace.png";
import shopify from "../../images/shopify.png";
import magneto from "../../images/magneto.png";
import ebay from "../../images/enbay.png";
import apple from '../../images/apple.png';

const Sponsored = () => {
  const logos = [
    { src: big, alt: "BigCommerce" },
    { src: amazon, alt: "Amazon" },
    { src: etsy, alt: "Etsy" },
    { src: squarespace, alt: "Squarespace" },
    { src: shopify, alt: "Shopify" },
    { src: magneto, alt: "Magento" },
    { src: apple, alt: "Apple" },
    { src: ebay, alt: "eBay" },
  ];

  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#003d29]">
            Trusted by Leading Brands
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8 place-items-center bg-gray-50/50 rounded-2xl p-6 border border-gray-100/50">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="opacity-75 hover:opacity-100 transition-opacity duration-200"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="w-[100px] h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsored;
