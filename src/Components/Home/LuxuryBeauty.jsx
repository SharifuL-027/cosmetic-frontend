import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShoppingBag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

export default function LuxuryBeauty() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  // Context থেকে addToCart ফাংশনটি নেওয়া হলো
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // --- ডাইনামিক ফিল্টারিং লজিক (প্রতি ক্যাটাগরি থেকে ১টি করে প্রোডাক্ট) ---
        const categoryMap = new Map();

        data.forEach((product) => {
          const categoryName = product.category?.main || product.category || 'Exclusive';
          if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, product);
          }
        });

        let curatedProducts = Array.from(categoryMap.values());

        if (curatedProducts.length < 4) {
          const remainingProducts = data.filter(
            (p) => !curatedProducts.some((cp) => cp._id === p._id)
          );
          curatedProducts = [...curatedProducts, ...remainingProducts];
        }

        setProducts(curatedProducts.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToBag = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-325 mx-auto">
        
        {/* Elegant Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
          >
            Curated Collection
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl poppins-bold-italic text-black tracking-tight uppercase mb-6"
          >
            Luxury <span className="text-[#CB006B]">Beauty</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-12 h-px bg-black/20"
          ></motion.div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-[#CB006B]" />
          </div>
        ) : (
          /* Square Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
            {products.map((product, index) => {
              const isAdded = addedId === product._id;
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Square Image Container */}
                  <div className="relative w-full aspect-square bg-[#F9F9F9] overflow-hidden mb-5 border border-gray-100">
                    <Link to={`/product/${product._id}`} className="absolute inset-0 z-10"></Link>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />

                    {/* Subtle Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Rounded Floating Add to Bag Button */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[82%] z-20 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <button
                        type="button"
                        onClick={(e) => handleAddToBag(e, product)}
                        className="w-full rounded-full bg-black text-white border border-black hover:bg-[#CB006B] hover:border-[#CB006B] py-3 px-5 text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added to Bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Minimalist Typography */}
                  <div className="flex flex-col px-1 text-center items-center">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1.5">
                      {product.category?.main || product.category || 'Exclusive'}
                    </span>

                    <Link
                      to={`/product/${product._id}`}
                      className="text-[12px] md:text-[13px] font-bold text-black hover:text-[#CB006B] transition-colors uppercase tracking-widest mb-1.5 line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    {/* Price in Euro */}
                    <span className="text-[13px] font-semibold text-gray-700">
                      €{Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Minimalist View All Link */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-20"
          >
            <Link
              to="/shop"
              className="group relative text-[11px] font-bold uppercase tracking-[0.2em] text-black pb-2"
            >
              Discover The Full Collection
              <span className="absolute bottom-0 left-0 w-full h-px bg-black origin-left transform scale-x-100 group-hover:scale-x-0 transition-transform duration-300"></span>
              <span className="absolute bottom-0 right-0 w-full h-px bg-[#CB006B] origin-right transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}