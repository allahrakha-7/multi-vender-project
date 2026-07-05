import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchOtherUsersProductsStart,
  fetchOtherUsersProductsSuccess,
  fetchOtherUsersProductsFailure,
} from "../../redux/reducers/productSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../ProductCard";

function BestDeals() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(fetchOtherUsersProductsStart());
        const res = await fetch('/api/products/all');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch products");

        dispatch(fetchOtherUsersProductsSuccess(data));
      } catch (error) {
        dispatch(fetchOtherUsersProductsFailure(error.message));
      }
    };

    fetchProducts();
  }, [dispatch]);

  const bestDealsProducts = products?.filter((item) =>
    item.bestDeals && (!currentUser || item.seller !== currentUser._id)
  ).slice(0, 12);
  const hasExcess = products?.filter((item) =>
    item.bestDeals && (!currentUser || item.seller !== currentUser._id)
  ).length > 12;

  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#003d29]">
            Best Deals
          </h2>
          <span className="hidden md:inline-block text-xs px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500 font-medium select-none">
            Hand‑picked for you
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 xl:gap-8 mb-6 relative">
          {loading ? (
            <p className="col-span-full text-center text-gray-400 py-10">Loading products...</p>
          ) : bestDealsProducts && bestDealsProducts.length > 0 ? (
            bestDealsProducts.map((item, idx) => (
              <ProductCard key={idx} data={item} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-10">No products found</p>
          )}

          {hasExcess && (
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-white/80 to-transparent blur-sm pointer-events-none" />
          )}
        </div>

        {hasExcess && (
          <div className="flex justify-center mt-6">
            <Link to="/products">
              <button className="bg-[#003d29] hover:bg-[#002e1f] text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-sm text-sm cursor-pointer">
                Explore More
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default BestDeals;