import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Filter, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartContext } from '../../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  // URL থেকে ফিল্টার প্যারামিটারগুলো ধরার জন্য
  const [searchParams] = useSearchParams();
  const mainCategory = searchParams.get('main');
  const subCategory = searchParams.get('sub');
  const subChildCategory = searchParams.get('subChild');
  const badge = searchParams.get('badge');

  // Context থেকে addToCart ফাংশনটি নেওয়া হলো
  const { addToCart } = useContext(CartContext);

  // ১. ডাটাবেস থেকে সব ডাটা ফেচ করা
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/products`);

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ২. URL পরিবর্তন হলে কেস-ইনসেন্সিটিভভাবে ডাটা ফিল্টার করা
  useEffect(() => {
    let result = products;

    if (mainCategory) {
      result = result.filter(
        (p) => p.category?.main?.toLowerCase().trim() === mainCategory.toLowerCase().trim()
      );
    }
    if (subCategory) {
      result = result.filter(
        (p) => p.category?.sub?.toLowerCase().trim() === subCategory.toLowerCase().trim()
      );
    }
    if (subChildCategory) {
      result = result.filter(
        (p) => p.category?.subChild?.toLowerCase().trim() === subChildCategory.toLowerCase().trim()
      );
    }
    if (badge) {
      result = result.filter(
        (p) => p.badge?.toLowerCase().trim() === badge.toLowerCase().trim()
      );
    }

    setFilteredProducts(result);
  }, [products, searchParams, mainCategory, subCategory, subChildCategory, badge]);

  const handleAdd = (product) => {
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1400);
  };

  // পেজের হেডিং ডাইনামিক করা
  const pageTitle = subChildCategory || subCategory || mainCategory || 'All Products';

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] pt-6 sm:pt-10 pb-20">
      <div className="max-w-350 mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Page Header (Mobile & Desktop Responsive) */}
        <div className="flex flex-row justify-between items-center sm:items-end mb-6 sm:mb-10 border-b border-gray-200 pb-4 sm:pb-6 gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl sm:text-3xl md:text-4xl poppins-bold-italic tracking-tighter text-black uppercase"
            >
              {pageTitle}
            </motion.h1>
            <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium uppercase tracking-widest">
              Showing {filteredProducts.length} results
            </p>
          </div>

          {/* Filter Button (Mobile + Desktop) */}
          <button className="flex items-center gap-1.5 sm:gap-2 border border-gray-300 bg-white px-3.5 py-2 sm:px-5 sm:py-2.5 hover:border-[#CB006B] hover:text-[#CB006B] transition-colors shrink-0">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Filter</span>
          </button>
        </div>

        {/* Loading & Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-[#CB006B]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center px-4">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-400 uppercase tracking-widest">
              No products found
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Try checking another category
            </p>
            <Link
              to="/shop"
              className="mt-6 sm:mt-8 border-2 border-[#CB006B] text-[#CB006B] px-6 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#CB006B] hover:text-white transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          /* মোবাইলে ২ কলাম, ট্যাবলেটে ৩ কলাম, ডেস্কটপে ৪ কলাম */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => {
              const isAdded = addedId === product._id;
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.35 }}
                  className="group relative flex flex-col justify-between bg-white border border-gray-100 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Image Container (মোবাইলে aspect-square ও ডেস্কটপে aspect-[4/5]) */}
                    <div className="relative w-full aspect-square sm:aspect-[4/5] bg-gray-50 overflow-hidden">
                      <Link to={`/product/${product._id}`} className="block w-full h-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                      </Link>

                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#CB006B] text-white text-[8px] sm:text-[9px] font-black tracking-widest px-2 py-1 sm:px-3 sm:py-1.5 uppercase shadow-sm">
                          {product.badge}
                        </div>
                      )}

                      {/* Desktop Hover Add to Bag Button */}
                      <div className="hidden lg:block absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                        <button
                          type="button"
                          onClick={() => handleAdd(product)}
                          className="w-full bg-black/90 hover:bg-[#CB006B] text-white py-3.5 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 backdrop-blur-sm transition-colors cursor-pointer"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" /> Add to Bag
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col text-center pt-3 pb-2.5 sm:pt-4 sm:pb-4 px-2.5 sm:px-4">
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                        {product.category?.sub || product.category?.main || 'Beauty'}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className="text-[11px] sm:text-[13px] font-bold text-black hover:text-[#CB006B] transition-colors uppercase tracking-wider line-clamp-2 min-h-[32px] sm:min-h-0 sm:line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <span className="text-xs sm:text-sm font-black text-gray-800 mt-1 sm:mt-1.5">
                        €{Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Mobile & Tablet Direct Add to Bag Button (হোভার ছাড়াই ক্লিক করা যাবে) */}
                  <div className="lg:hidden px-2.5 pb-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className="w-full bg-black active:bg-[#CB006B] text-white py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}