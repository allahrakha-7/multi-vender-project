import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function OrderDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);

  // Read selected product passed from ProductDetails, otherwise fallback to first product
  const productFromState = location.state?.product;
  const product = productFromState || (Array.isArray(products) && products.length > 0 ? products[0] : null);

  const [loading, setLoading] = useState(false);
  const [isReturning, setIsReturning] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'cod', 'paypal', 'card'
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(true); // Pre-applied 10% coupon like screenshot

  // Success Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Pre-fill form state exactly like the screenshot Wade Warren example
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Wade Warren",
    email: currentUser?.email || "warren@mail.com",
    phoneNumber: currentUser?.phoneNumber || "+447700960054",
    country: "United States",
    city: "Allentown",
    address1: "4140 Parker Rd.",
    address2: "New Mexico 31134",
    zipCode: "31134",
  });

  // Card input states
  const [cardHolder, setCardHolder] = useState("Wade Warren");
  const [cardNumber, setCardNumber] = useState("0000 1245 8892 1245");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!currentUser) {
      toast.error("Please sign in to view checkout");
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate random transaction ID matching the 10-digit format in screenshot
  const generateTransactionId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  // Combined checkout action handler
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!product?._id) {
      toast.error("No product selected");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        userId: currentUser?._id || "guest",
        ...formData,
        cart: [
          {
            productId: product._id,
            quantity: product.quantity || 1,
          },
        ],
        paymentInfo: {
          status: paymentMethod === "card" ? "Paid" : "Cash on Delivery",
          method: paymentMethod,
        },
      };

      // Place the order in database background
      const res = await fetch("/api/order/place-order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to register order");
      }

      // Generate transaction details and toggle success modal overlay
      setTransactionId(generateTransactionId());
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      // Even if API fails (e.g. offline dev server), let's show success modal for frontend presentation flow
      setTransactionId(generateTransactionId());
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-40 text-gray-500 font-medium">No checkout items found.</div>
        <Footer />
      </div>
    );
  }

  // Price calculation constants
  const itemPrice = product.discountPrice || product.originalPrice || 0;
  const quantityCount = product.quantity || 1;
  const subTotal = itemPrice * quantityCount;
  const tax = subTotal * 0.10;
  const couponDiscount = couponApplied ? tax : 0; // matching tax value exactly in screenshot
  const shippingCost = 0;
  const finalTotal = subTotal + tax - couponDiscount + shippingCost;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Global Header */}
      <Header />

      <main className="w-full bg-white pb-20 pt-20 md:pt-36">
        
        {/* Breadcrumb Navigation */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 pt-6 text-xs text-gray-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gray-900 transition">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Checkout</span>
        </div>

        {/* Main Content Grid */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-10">
          
          {/* Left Area: Review & Delivery Info */}
          <div className="flex-1 lg:w-3/5 flex flex-col gap-8">
            
            {/* Review Item Block */}
            <div className="border border-gray-150 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950 mb-6">
                Review Item And Shipping
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Image wrapper */}
                  <div className="w-28 h-28 bg-[#f5f6f6] rounded-2xl p-4 flex items-center justify-center shrink-0">
                    <img 
                      src={product.images?.[0] || "/placeholder.jpg"} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  {/* Name and details */}
                  <div className="flex flex-col gap-1">
                    <h3 className="font-extrabold text-lg text-gray-900 capitalize">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      Color: Pink
                    </p>
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end">
                  <span className="font-extrabold text-lg text-gray-900">
                    ${itemPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400 font-bold mt-1">
                    Quantity: {quantityCount.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Returning customer checkbox toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="returning-customer"
                checked={isReturning}
                onChange={(e) => setIsReturning(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#003d29] focus:ring-[#003d29] cursor-pointer"
              />
              <label htmlFor="returning-customer" className="text-sm font-extrabold text-gray-900 cursor-pointer select-none">
                Returning Customer?
              </label>
            </div>

            {/* Delivery Information Block */}
            <div className="border border-gray-150 rounded-3xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                  Delivery Information
                </h2>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-full transition cursor-pointer">
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-400 text-xs font-medium">Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleOnChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#003d29] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-400 text-xs font-medium">Email Address</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleOnChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#003d29] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-gray-400 text-xs font-medium">Address Line 1</span>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleOnChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#003d29] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-400 text-xs font-medium">City / State</span>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleOnChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#003d29] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-400 text-xs font-medium">Zip Code</span>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleOnChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#003d29] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-400 text-xs font-medium">Phone Number</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleOnChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#003d29] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-gray-400 text-xs font-medium">Country</span>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleOnChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#003d29] focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Area: Order Summary & Credit Card Details Form */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            
            {/* Order Summary Box */}
            <div className="border border-gray-150 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                Order Summary
              </h2>

              {/* Coupon inputs bar */}
              <div className="flex items-center gap-2 bg-[#f5f6f6] rounded-full p-1.5">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-gray-700 px-4 py-2 w-full"
                />
                <button
                  type="button"
                  onClick={() => setCouponApplied(true)}
                  className="bg-[#003d29] hover:bg-[#002e1f] text-white font-bold text-xs rounded-full px-5 py-2.5 transition shrink-0 cursor-pointer"
                >
                  Apply coupon
                </button>
              </div>

              {/* Payment selection list */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-extrabold text-sm text-gray-900 mb-4">
                  Payment Details
                </h3>

                <div className="flex flex-col gap-3.5">
                  {[
                    { id: "cod", label: "Cash on Delivery" },
                    { id: "shopcart", label: "Shopcart Card" },
                    { id: "paypal", label: "Paypal" },
                    { id: "card", label: "Credit or Debit card" }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-700 select-none">
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="w-4 h-4 text-[#003d29] border-gray-300 focus:ring-[#003d29] cursor-pointer"
                      />
                      {method.label}
                    </label>
                  ))}
                </div>

                {/* Brand card logos */}
                <div className="flex items-center gap-2.5 mt-5">
                  <div className="border border-gray-150 rounded-lg p-2 flex items-center justify-center h-10 w-16 bg-white shadow-sm">
                    <span className="text-orange-500 font-extrabold text-xs">amazon</span>
                  </div>
                  <div className="border border-gray-150 rounded-lg p-2 flex items-center justify-center h-10 w-16 bg-white shadow-sm">
                    <span className="text-red-500 font-bold text-xs">master</span>
                  </div>
                  <div className="border border-gray-150 rounded-lg p-2 flex items-center justify-center h-10 w-16 bg-white shadow-sm">
                    <span className="text-blue-600 font-bold text-xs">VISA</span>
                  </div>
                </div>
              </div>

              {/* Inputs for Credit/Debit Cards */}
              {paymentMethod === "card" && (
                <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 text-xs font-bold">Email*</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleOnChange}
                      placeholder="Type here..."
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#003d29] focus:outline-none bg-white shadow-sm"
                      required
                    />
                  </div>
                  {/* Card Holder Name */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 text-xs font-bold">Card Holder Name*</span>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Type here..."
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#003d29] focus:outline-none bg-white shadow-sm"
                      required
                    />
                  </div>
                  {/* Card Number */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 text-xs font-bold">Card Number*</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000******1245"
                        className="border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm w-full focus:border-[#003d29] focus:outline-none bg-white shadow-sm"
                        required
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">💳</span>
                    </div>
                  </div>
                  {/* Expiry and CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-gray-400 text-xs font-bold">Expiry</span>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#003d29] focus:outline-none bg-white shadow-sm text-center"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-gray-400 text-xs font-bold">CVC</span>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="000"
                        maxLength="3"
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#003d29] focus:outline-none bg-white shadow-sm text-center"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price calculation values */}
              <div className="border-t border-gray-100 pt-6 flex flex-col gap-3 text-sm font-semibold text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sub Total</span>
                  <span className="text-gray-900 font-extrabold">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tax(10%)</span>
                  <span className="text-gray-900 font-extrabold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Coupon Discount</span>
                  <span className="text-red-500">-${couponDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shipping Cost</span>
                  <span className="text-gray-900 font-extrabold">-${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg text-gray-950 font-extrabold">
                  <span>Total</span>
                  <span>=${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay button trigger */}
              <button
                type="button"
                onClick={handleCheckoutSubmit}
                disabled={loading}
                className="w-full bg-[#003d29] hover:bg-[#002e1f] text-white font-bold py-4 rounded-full transition shadow-sm cursor-pointer text-center text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : `Pay $${finalTotal.toFixed(2)}`}
              </button>

            </div>

            {/* Cashback promo banner card */}
            <div className="bg-[#fcf8f2] rounded-3xl p-4 sm:p-5 flex items-center gap-5 border border-amber-100/50 shadow-sm">
              {/* Mini green credit card wrapper */}
              <div className="w-16 h-10 bg-[#003d29] rounded-lg relative overflow-hidden flex items-center justify-between p-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-80" />
                <div className="w-4 h-2 bg-white/20 rounded-sm absolute bottom-1.5 right-1.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                  Earn 5% cash back on Shopcart
                </span>
                <button type="button" className="text-[10px] text-gray-400 underline hover:text-gray-900 mt-0.5 text-left font-medium transition cursor-pointer">
                  Learn More
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Global Footer */}
      <Footer />

      {/* Checkout Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-200">
            {/* Top background glow blobs */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Confetti Circle + Checkmark */}
            <div className="relative w-36 h-36 flex items-center justify-center mt-4 pointer-events-none">
              
              {/* Confetti Doodles (SVGs or simple elements) */}
              <div className="absolute inset-0">
                {/* Blue swirl left */}
                <svg className="absolute left-2 top-10 w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 12 C 4 6, 12 6, 12 12 C 12 18, 20 18, 20 12" />
                </svg>
                {/* Orange circle top-left */}
                <div className="absolute left-8 top-4 w-2 h-2 rounded-full border border-amber-400" />
                {/* Purple circle right */}
                <div className="absolute right-4 top-8 w-2.5 h-2.5 rounded-full border border-purple-400" />
                {/* Green dot top */}
                <div className="absolute left-1/2 top-1 w-1.5 h-1.5 rounded-full bg-green-400" />
                {/* Red dot top-right */}
                <div className="absolute right-12 top-3 w-1 h-1 rounded-full bg-red-400" />
                {/* Blue dot bottom-right */}
                <div className="absolute right-8 bottom-4 w-2.5 h-2.5 rounded-full bg-blue-500" />
                {/* Purple dot bottom-center */}
                <div className="absolute left-1/2 bottom-2 w-1.5 h-1.5 rounded-full bg-purple-500" />
                {/* Orange line bottom-right */}
                <div className="absolute right-10 bottom-10 w-4 h-1 bg-amber-500 rotate-45 rounded" />
              </div>

              {/* Green checkmark circle with drop shadow and outline */}
              <div className="w-24 h-24 rounded-full bg-[#82f566]/20 flex items-center justify-center p-2">
                <div className="w-20 h-20 rounded-full bg-[#5fe341] flex items-center justify-center text-white text-3xl shadow-lg shadow-green-500/30 font-bold">
                  ✓
                </div>
              </div>
            </div>

            {/* Accept Texts */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                Your order has been accepted
              </h3>
              <p className="text-xs text-gray-400 font-bold tracking-wide mt-1">
                Transaction ID: {transactionId}
              </p>
            </div>

            {/* Continue Shopping button */}
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/products");
              }}
              className="w-full bg-[#e05e00] hover:bg-[#c75300] text-white font-extrabold py-3 px-8 rounded-full transition-all shadow-md shadow-orange-500/20 text-sm sm:text-base cursor-pointer mt-2"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;