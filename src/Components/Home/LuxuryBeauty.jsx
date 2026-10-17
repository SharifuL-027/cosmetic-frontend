import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// ক্লিন প্রোডাক্ট ডেটা (শুধুমাত্র আইডি, নাম এবং ছবি)
const bestProducts = [
  {
    id: 1,
    name: "LUMINA GLOW FOUNDATION",
    image: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "VELVET MATTE LIPSTICK",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2015&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "RADIANT EYESHADOW PALETTE",
    image: "https://images.unsplash.com/photo-1512496015851-a1c8d4f70b73?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "HYDRATING NIGHT SERUM",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop",
  }
];

export default function LuxuryBeauty() {
  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#E45B83] text-xs font-bold tracking-[0.2em] uppercase mb-4"
          >
            Discover Our
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black italic tracking-tighter text-black uppercase font-['Arial_Black',sans-serif]"
          >
            Luxury Beauty
          </motion.h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative flex flex-col bg-white"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-4/5 bg-gray-50 overflow-hidden mb-4">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </Link>

                {/* Quick Add Button (Visible on hover) */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <button className="w-full bg-black/90 hover:bg-[#E45B83] text-white py-3.5 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 backdrop-blur-sm transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag
                  </button>
                </div>
              </div>

              {/* Product Info (শুধুমাত্র নাম) */}
              <div className="flex flex-col grow text-center mt-2">
                <Link to={`/product/${product.id}`} className="text-sm font-bold text-black hover:text-[#E45B83] transition-colors uppercase tracking-wide">
                  {product.name}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-16"
        >
          <Link 
            to="/shop" 
            className="border-2 border-black text-black px-10 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}