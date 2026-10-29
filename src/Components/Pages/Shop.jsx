import { useState, useEffect, useContext } from 'react'; // useContext যুক্ত করা হয়েছে
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartContext } from '../../context/CartContext'; 

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // URL থেকে ফিল্টার প্যারামিটারগুলো ধরার জন্য
  const [searchParams] = useSearchParams();
  const mainCategory = searchParams.get('main');
  const subCategory = searchParams.get('sub');
  const subChildCategory = searchParams.get('subChild');
  const badge = searchParams.get('badge');

  // Context থেকে addToCart ফাংশনটি নেওয়া হলো
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

  // ২. URL পরিবর্তন হলে সেই অনুযায়ী ডাটা ফিল্টার করা
  useEffect(() => {
    let result = products;

    if (mainCategory) {
      result = result.filter(p => p.category?.main === mainCategory);
    }
    if (subCategory) {
      result = result.filter(p => p.category?.sub === subCategory);
    }
    if (subChildCategory) {
      result = result.filter(p => p.category?.subChild === subChildCategory);
    }
    if (badge) {
      result = result.filter(p => p.badge?.toLowerCase() === badge.toLowerCase());
    }

    setFilteredProducts(result);
  }, [products, searchParams]);

  // পেজের হেডিং ডাইনামিক করা
  const pageTitle = subChildCategory || subCategory || mainCategory || "All Products";

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] pt-10 pb-20">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl poppins-bold-italic tracking-tighter text-black uppercase "
            >
              {pageTitle}
            </motion.h1>
            <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">
              Showing {filteredProducts.length} results
            </p>
          </div>
          
          {/* Filter Button */}
          <button className="hidden md:flex items-center gap-2 border border-gray-300 px-5 py-2 hover:border-[#CB006B] hover:text-[#CB006B] transition-colors mt-4 md:mt-0">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
          </button>
        </div>

        {/* Loading & Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-[#CB006B]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">No products found</h2>
            <p className="text-gray-400 text-sm mt-2">Try checking another category</p>
            <Link to="/shop" className="mt-8 border-2 border-[#CB006B] text-[#CB006B] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#CB006B] hover:text-white transition-colors">
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative flex flex-col bg-white border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden mb-4">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  </Link>

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#CB006B] text-white text-[9px] font-black tracking-widest px-3 py-1.5 uppercase shadow-md">
                      {product.badge}
                    </div>
                  )}

                  {/* Quick Add Button - এখানে onClick ফাংশন যুক্ত করা হয়েছে */}
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-black/90 hover:bg-[#CB006B] text-white py-3.5 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 backdrop-blur-sm transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col grow text-center mt-2 pb-5 px-4">
                  <Link to={`/product/${product._id}`} className="text-[13px] font-bold text-black hover:text-[#CB006B] transition-colors uppercase tracking-widest line-clamp-1">
                    {product.name}
                  </Link>
                  <span className="text-sm font-bold text-gray-500 mt-1.5">
                    ৳{product.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}