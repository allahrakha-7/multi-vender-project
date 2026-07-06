// pages/PhoneAndTablets.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOtherUsersProductsStart,
  fetchOtherUsersProductsSuccess,
  fetchOtherUsersProductsFailure,
} from "../redux/reducers/productSlice";

import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PhoneAndTablets = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useSelector((state) => state.user);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ brand: "", priceRange: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(fetchOtherUsersProductsStart());
        const res = await fetch("/api/products?category=Electronics", {
          credentials: "include",
        });
        console.log("Fetch response status:", res.status);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch products");
        dispatch(fetchOtherUsersProductsSuccess(data));
      } catch (error) {
        console.error("Fetch error:", error);
        dispatch(fetchOtherUsersProductsFailure(error.message));
      }
    };
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.category === "Electronics" &&
      (product.tags.includes("phone") || product.tags.includes("tablet"))
    );

    if (filters.brand) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product) =>
          product.discountPrice >= min && (max ? product.discountPrice <= max : true)
      );
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const phoneAndTabletProducts = filteredProducts.length > 0 ? filteredProducts : products.filter(
    (product) =>
      product.category === "Electronics" &&
      (product.tags.includes("phone") || product.tags.includes("tablet"))
  );

  
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Phones & Tablets</h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore the latest smartphones and tablets on Vendify
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Brand</label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
              >
                <option value="">All Brands</option>
                <option value="samsung">Samsung</option>
                <option value="apple">Apple</option>
                <option value="xiaomi">Xiaomi</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
              >
                <option value="">All Prices</option>
                <option value="0-50000">Under Rs. 50,000</option>
                <option value="50000-100000">Rs. 50,000 - Rs. 100,000</option>
                <option value="100000-250000">Rs. 100,000 - Rs. 250,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section className="mb-12">
          {loading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : phoneAndTabletProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {phoneAndTabletProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 mt-2">
                    Rs. {Number(product.discountPrice).toLocaleString()} <span className="line-through text-gray-400">Rs. {Number(product.originalPrice).toLocaleString()}</span>
                  </p>
                  <Link
                    to={`/product/${product._id}`}
                    className="mt-4 inline-block text-[#00bf63] font-semibold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No phones or tablets found.</p>
          )}
        </section>
      </div>
    </div>
    </>
  );
};

export default PhoneAndTablets;