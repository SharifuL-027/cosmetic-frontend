import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// ডামি ডায়নামিক ডেটা (ভবিষ্যতে এটি API থেকে আসবে)
const categoryData = [
  {
    id: 1,
    cover: {
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop",
      title: "DIP, BLEND & BLUSH",
      subtitle: "Blendable formulas bursting with colour and pigment"
    },
    lookTitle: "GET THE LOOK",
    products: [
      {
        id: 101,
        name: "It's Glow Prime Radiant Primer",
        price: "£6.50",
        // ট্রান্সপারেন্ট ব্যাকগ্রাউন্ডের মতো প্রোডাক্ট ইমেজ
        image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1792229508/image.png_2K_20261017152946_c8jojw.jpg",
        rating: 5,
        reviews: 175,
        shades: [] // প্রাইমারের কোনো শেড নেই
      },
      {
        id: 102,
        name: "Blushful Cream To Powder Blusher",
        price: "£6.00",
        image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1792231631/image.png_2K_20261017160340_gy7aw4.jpg",
        rating: 5,
        reviews: 13,
        shades: ['#e5989b', '#d5bdaf', '#b56576', '#e56b6f'] // ব্লাশারের ৪টি কালার শেড
      }
    ]
  }
];

export default function CategoryShowcase() {
  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] mx-auto">
        
        {categoryData.map((category, index) => (
          <div 
            key={category.id} 
            // জোর-বিজোড় ইনডেক্স অনুযায়ী কভার ছবি একবার ডানে, একবার বামে থাকবে
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''} mb-24 last:mb-0`}
          >
            
            {/* Left Side: Cover Image & Info */}
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2 flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square md:aspect-[4/5] rounded-xl overflow-hidden mb-8">
                <img 
                  src={category.cover.image} 
                  alt={category.cover.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-black font-['Arial_Black',sans-serif]">
                {category.cover.title}
              </h2>
              <p className="text-sm md:text-base text-gray-700 mt-3 font-medium max-w-sm">
                {category.cover.subtitle}
              </p>
            </motion.div>

            {/* Right Side: Products ("GET THE LOOK") */}
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:w-1/2 flex flex-col"
            >
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-black font-['Arial_Black',sans-serif] mb-10 text-center lg:text-left">
                {category.lookTitle}
              </h2>

              <div className="grid grid-cols-2 gap-6 md:gap-12">
                {category.products.map(product => (
                  <div key={product.id} className="flex flex-col items-center text-center group cursor-pointer">
                    
                    {/* Product Image */}
                    <Link to={`/product/${product.id}`} className="w-full aspect-[3/4] bg-white flex items-center justify-center p-4 mb-5 overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                    </Link>

                    {/* Product Info */}
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-black mb-2 hover:text-[#CB006B] transition-colors tracking-wide">
                        {product.name}
                      </h3>
                    </Link>
                    <span className="text-sm font-black text-black mb-3">
                      {product.price}
                    </span>

                    {/* Stars & Reviews */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} 
                        />
                      ))}
                      <span className="text-[10px] text-gray-500 font-medium ml-1">{product.reviews} Reviews</span>
                    </div>

                    {/* Color Shades (যদি থাকে) */}
                    {product.shades && product.shades.length > 0 && (
                      <div className="flex items-center justify-center gap-2 mt-auto">
                        {product.shades.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm hover:scale-125 cursor-pointer transition-transform" 
                            style={{ backgroundColor: color }}
                            title="Color Shade"
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        ))}
        
      </div>
    </section>
  );
}