import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  createProductStart,
  createProductSuccess,
  createProductFailure,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
} from "../redux/reducers/productSlice";
import { RxCross2 } from "react-icons/rx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
  // eslint-disable-next-line no-unused-vars
  const [imageUploadError, setImageUploadError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { products, loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    images: [],
    shop: "",
    userRef: currentUser?._id || "",
    bestDeals: false,
    featuredProducts: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser) {
        toast.error("Please log in to view your products.");
        return;
      }
      try {
        dispatch(fetchProductsStart());
        const res = await fetch(`/api/products/get/${currentUser._id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch your products");
        }
        dispatch(fetchProductsSuccess(data));
      } catch (err) {
        dispatch(fetchProductsFailure(err.message));
      }
    };
    fetchProducts();
  }, [dispatch, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + formData.images.length > 5) {
      setImageUploadError(true);
      toast.error("You can only upload up to 5 images per listing!");
      return;
    }
    setUploading(true);
    setImageUploadError(false);
    const uploadPromises = selectedFiles.map((file) => storeImage(file));
    const urls = await Promise.all(uploadPromises);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    setImageUploadError(false);
    setUploading(false);
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "multi_vendor_images");
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
      xhr.onload = () => (xhr.status === 200 ? resolve(JSON.parse(xhr.responseText).secure_url) : reject(xhr.responseText));
      xhr.onerror = () => reject("XHR request failed");
      xhr.send(formData);
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      tags: product.tags?.join(", ") || "",
      originalPrice: product.originalPrice || "",
      discountPrice: product.discountPrice || "",
      stock: product.stock || "",
      images: product.images || [],
      shop: product.shop || "",
      userRef: product.userRef || currentUser?._id || "",
      bestDeals: product.bestDeals || false,
      featuredProducts: product.featuredProducts || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser.role !== 'seller') {
      toast.error('Update your profile to seller account then create products');
      return;
    }
    if (formData.images.length < 1) {
      toast.error("You must upload at least one image!");
      return;
    }
    try {
      setUploading(true);
      dispatch(createProductStart());
      const userRef = currentUser._id;
      const shopId = currentUser._id;
      const shop = formData.shop;
      const payload = { ...formData, userRef, shopId, shop };

      let res;
      if (editingProductId) {
        res = await fetch(`/api/products/update/${editingProductId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/products/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to process product");
      
      if (editingProductId) {
        toast.success("Product updated successfully!");
        setEditingProductId(null);
      } else {
        dispatch(createProductSuccess(data));
        toast.success("Product created successfully!");
      }

      setFormData({
        name: "",
        description: "",
        category: "",
        tags: "",
        originalPrice: "",
        discountPrice: "",
        stock: "",
        images: [],
        shop: "",
        userRef: currentUser?._id || "",
        bestDeals: false,
        featuredProducts: false,
      });

      const fetchRes = await fetch(`/api/products/get/${currentUser._id}`, {
        method: "GET",
        credentials: "include",
      });
      const fetchData = await fetchRes.json();
      if (fetchRes.ok) dispatch(fetchProductsSuccess(fetchData.filter(product => product.userRef === currentUser._id)));
    } catch (error) {
      dispatch(createProductFailure(error.message));
      toast.error(error.message || "Error processing product.");
    } finally {
      setUploading(false);
    }
  };

const handleRemoveProduct = async (productId) => {
    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }
    try {
      dispatch(deleteProductStart());
      const res = await fetch(`/api/products/delete/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");
      dispatch(deleteProductSuccess(productId));
      toast.success("Product deleted successfully!");
      dispatch(fetchProductsStart());
      const fetchRes = await fetch(`/api/products/get/${currentUser._id}`, {
        method: "GET",
        credentials: "include",
      });
      const fetchData = await fetchRes.json();
      if (fetchRes.ok) dispatch(fetchProductsSuccess(fetchData.filter(product => product.userRef === currentUser._id)));
      else throw new Error(fetchData.message || "Failed to refresh products");
    } catch (error) {
      dispatch(deleteProductFailure(error.message));
      toast.error(error.message || "Error deleting product.");
    }
  };

const getStarRating = (rating) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400 text-lg">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400 text-lg">½</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300 text-lg">☆</span>);
    }
    return stars;
  };


  return (
    <>
      <div className="w-full max-sm:mt-5 mt-9 flex flex-col py-10">
        <div className="w-full px-2 space-y-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full p-4 sm:p-6 md:p-8 rounded-xl shadow-lg space-y-4 sm:space-y-5"
          >
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-green-600 flex items-center gap-2">
              <FaPlus /> {editingProductId ? "Edit Product" : "Create Product"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  Product Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  Category:
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  Tags:
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., tag1, tag2"
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  Shop Name:
                </label>
                <input
                  type="text"
                  name="shop"
                  value={formData.shop}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  Original Price:
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  Discount Price:
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  Stock:
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">
                Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:border-none focus:outline-none focus:ring-green-500 resize-none h-24 sm:h-32 md:h-40"
              />
            </div>
            <div>
              <label className="text-sm sm:text-base md:text-lg font-medium text-gray-700 flex items-center gap-1">
                <FaImage /> Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 mt-1 focus:ring-1 focus:ring-green-500 focus:border-transparent cursor-pointer"
              />
              <div className="flex gap-2 sm:gap-3 mt-2 flex-wrap">
                {formData.images.map((src, i) => (
                  <div key={i} className="relative w-1/4 sm:w-1/5 md:w-1/6 aspect-square">
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-full object-contain rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute -top-1 sm:-top-2 md:-top-3 z-10 -right-1 sm:-right-2 md:-right-3 bg-red-500 text-white rounded-full w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 flex items-center justify-center text-xs sm:text-sm hover:bg-red-600"
                    >
                      <RxCross2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Enhanced Checkbox Section */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
              <label className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="bestDeals"
                  checked={formData.bestDeals}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <span className="w-5 h-5 border-2 border-green-600 rounded flex items-center justify-center bg-white peer-checked:bg-green-600 peer-checked:text-white transition-colors duration-200">
                  <FaPlus className="text-xs opacity-0 peer-checked:opacity-100" />
                </span>
                Best Deals
              </label>
              <label className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="featuredProducts"
                  checked={formData.featuredProducts}
                  onChange={handleChange}
                  className="hidden peer"
                />
                <span className="w-5 h-5 border-2 border-green-600 rounded flex items-center justify-center bg-white peer-checked:bg-green-600 peer-checked:text-white transition-colors duration-200">
                  <FaPlus className="text-xs opacity-0 peer-checked:opacity-100" />
                </span>
                Featured Products
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-2 sm:py-3 md:py-4 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed transition-colors"
              >
                {editingProductId ? "Save Changes" : "Create Product"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    setFormData({
                      name: "",
                      description: "",
                      category: "",
                      tags: "",
                      originalPrice: "",
                      discountPrice: "",
                      stock: "",
                      images: [],
                      shop: "",
                      userRef: currentUser?._id || "",
                      bestDeals: false,
                      featuredProducts: false,
                    });
                  }}
                  className="w-full bg-gray-500 text-white font-semibold py-2 sm:py-3 md:py-4 px-4 rounded-lg hover:bg-gray-600 focus:outline-none transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
          <div className="flex items-center justify-between m-3">
            <h2 className="text-[27px] text-gray-800 md:text-[32px] font-[700] font-Roboto relative">
              Your Products
              <span className="absolute -bottom-2 left-0 h-[3px] w-10 rounded-full bg-yellow-500/80" />
            </h2>
            <span className="hidden md:inline-block text-sm px-3 py-1.5 rounded-full bg-white shadow-sm text-amber-400 font-medium">
              For Sale
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10">
            {Array.isArray(products) ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="border w-full border-gray-900 rounded-lg p-2 sm:p-3 md:p-2 shadow-gray-500 shadow-md bg-white hover:shadow-lg transition-all duration-200 space-y-2"
                >
                  <div className="relative w-full aspect-[4/3]">
                    {product.images?.length > 1 ? (
                      <Swiper
                        navigation={{ nextEl: null, prevEl: null }}
                        modules={[Navigation]}
                        className="w-full h-full"
                        spaceBetween={10}
                        slidesPerView={1}
                      >
                        {product.images.map((src, i) => (
                          <SwiperSlide key={i}>
                            <img
                              src={src}
                              alt={`slide-${i}`}
                              className="w-full h-full object-contain"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <img
                        src={product.images?.[0] || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                    <hr className="border-t border-gray-300 my-2" />
                    <button
                      onClick={() => handleRemoveProduct(product._id)}
                      className="absolute top-1 sm:top-2 md:top-2 right-2 sm:right-1 md:right-1 bg-red-600 text-white rounded-full w-5 sm:w-6 md:w-6 h-5 sm:h-6 md:h-6 flex items-center justify-center text-xs sm:text-sm hover:bg-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 z-10"
                      aria-label={`Delete ${product.name}`}
                    >
                      <RxCross2 />
                    </button>
                  </div>

                  <h4 className="text-lg sm:text-xl md:text-[22px] font-bold text-green-700 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 line-clamp-2 break-words">
                    {product.description.length > 100
                      ? product.description.slice(0, 100) + "..."
                      : product.description}
                  </p>

                  <div className="flex items-center font-semibold gap-2">
                    <span className="text-md sm:text-base md:text-lg text-green-600 font-semibold">
                      Rs. {product.discountPrice || 0}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-500 line-through">
                      Rs. {product.originalPrice || 0}
                    </span>
                    <span className="ml-auto text-xs sm:text-xs md:text-base font-semibold bg-yellow-100 text-yellow-800 px-2 rounded-full">
                      {product.originalPrice && product.discountPrice
                        ? Math.round(
                          ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
                        ) || 0
                        : "0"}
                      % OFF
                    </span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-sm text-gray-500">
                    <span>Stock: {product.stock || 0}</span>
                    <span>Category: {product.category || "N/A"}</span>
                  </div>

                  <p className="text-xs sm:text-sm md:text-base italic text-gray-500">
                    Shop: {product.shop || "N/A"}
                  </p>

                  {product.ratings !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">Rating:</span>
                      <div className="flex">{getStarRating(product.ratings)}</div>
                      <span className="text-sm text-gray-500 ml-1">({product.reviews.length} reviews)</span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 text-sm bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                      onClick={() => {
                        navigate(`/product/${product._id}`, { state: { product } });
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="flex-1 text-sm bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit Product
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-yellow-500 text-center col-span-full">
                Products data is invalid. Please check the server response.
              </p>
            )}
          </div>
          {products.length === 0 && !loading && (
            <p className="text-gray-500 text-center w-full col-span-full mt-4 sm:mt-6 md:mt-8">
              No products created yet.
            </p>
          )}
          {loading && (
            <p className="text-center text-gray-600 w-full col-span-full mt-4 sm:mt-6 md:mt-8">
              {error ? "Error loading products..." : "Loading products..."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateProduct;