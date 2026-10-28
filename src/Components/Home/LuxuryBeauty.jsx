import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LuxuryBeauty() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // ঠিক ৪টি প্রোডাক্ট শো করার জন্য slice(0, 4) ব্যবহার করা হয়েছে
        setProducts(data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] mx-auto">
        
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
            className="text-4xl md:text-5xl font-light text-black tracking-tight mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
          >
            Luxury <span className="italic text-[#CB006B]">Beauty</span>
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-12 h-[1px] bg-black/20"
          ></motion.div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-[#CB006B]" />
          </div>
        ) : (
          /* Premium Editorial Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }}
                className="group flex flex-col cursor-pointer"
              >
                {/* Tall Image Container for Fashion/Beauty Aesthetic */}
                <div className="relative w-full aspect-[3/4] bg-[#F9F9F9] overflow-hidden mb-6">
                  <Link to={`/product/${product._id}`} className="absolute inset-0 z-10"></Link>
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  />

                  {/* Subtle Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Floating Action Button (Shows on hover) */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <button className="w-full bg-white text-black border border-transparent hover:border-black py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg transition-all">
                      Quick Shop
                    </button>
                  </div>
                </div>

                {/* Left-aligned Minimalist Typography */}
                <div className="flex flex-col px-1">
                  <Link 
                    to={`/product/${product._id}`} 
                    className="text-[11px] md:text-xs font-bold text-black hover:text-[#CB006B] transition-colors uppercase tracking-widest mb-1.5 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <span className="text-[13px] text-gray-500">
                    £{product.price.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
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
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-left transform scale-x-100 group-hover:scale-x-0 transition-transform duration-300"></span>
              <span className="absolute bottom-0 right-0 w-full h-[1px] bg-[#CB006B] origin-right transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}