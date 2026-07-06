// pages/Shipping.jsx
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
    <IoArrowBack
        onClick={goBack}
        className="text-2xl cursor-pointer absolute top-4 max-sm:top-2 max-sm:left-2 left-4 max-sm:text-xl font-semibold"
      />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Shipping Information</h1>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about shipping with Vendify
          </p>
        </div>

        {/* Shipping Details Section */}
        <section className="space-y-8">
          {/* Delivery Times */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Times</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Urban Areas (e.g., Islamabad, Lahore, Karachi):</strong> 2-5 business days
              </li>
              <li>
                <strong>Rural Areas:</strong> 5-7 business days
              </li>
              <li>
                <strong>International Shipping:</strong> 7-14 business days (depending on location)
              </li>
              <li>
                Delivery times may vary during peak seasons or due to unforeseen circumstances.
              </li>
            </ul>
          </div>

          {/* Shipping Costs */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Costs</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Free Shipping:</strong> On orders above Rs. 5,000 within Pakistan
              </li>
              <li>
                <strong>Standard Shipping:</strong> Rs. 500 flat rate for orders below Rs. 5,000
              </li>
              <li>
                <strong>International Shipping:</strong> Calculated at checkout based on weight and
                destination
              </li>
            </ul>
          </div>

          {/* Tracking */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Your Order</h2>
            <p className="text-gray-600">
              Once your order is shipped, you’ll receive a tracking number via email. Track your
              package anytime by logging into your Vendify account or visiting our{" "}
              <Link to="/track-order" className="text-[#00bf63] hover:underline">
                Track Order
              </Link>{" "}
              page.
            </p>
          </div>

          {/* International Shipping */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Shipping</h2>
            <p className="text-gray-600">
              We ship to select countries worldwide. Customs fees or import duties may apply and
              are the responsibility of the recipient. Check availability at checkout.
            </p>
          </div>

          {/* Policies */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Policies</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Orders are processed within 1-2 business days.</li>
              <li>Items must be in stock; out-of-stock items will be backordered.</li>
              <li>Perishable or fragile items may have special shipping restrictions.</li>
              <li>Contact us for expedited shipping options.</li>
            </ul>
          </div>
        </section>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have more questions about shipping? We’re here to help!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#00bf63] text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Shipping;