import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1792229508/image.png_2K_20261017152946_c8jojw.jpg",
        rating: 5,
        reviews: 175,
        shades: [] 
      },
      {
        id: 102,
        name: "Blushful Cream To Powder Blusher",
        price: "£6.00",
        image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1792231631/image.png_2K_20261017160340_gy7aw4.jpg",
        rating: 5,
        reviews: 13,
        shades: ['#e5989b', '#d5bdaf', '#b56576', '#e56b6f']
      }
    ]
  }
];

export default function CategoryShowcase() {
  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-300 mx-auto">
        
        {categoryData.map((category, index) => (
          <div 
            key={category.id} 
            className={`flex flex-col lg:flex-row items-start gap-12 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''} mb-24 last:mb-0`}
          >
            
            {/* Left Side: Cover Image & Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-[45%] flex flex-col items-center text-center"
            >
              {/* Image Container - Strictly 1:1 Aspect Ratio everywhere */}
              <div className="w-full aspect-square rounded-[20px] overflow-hidden mb-6 shadow-sm">
                <img 
                  src={category.cover.image} 
                  alt={category.cover.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              <h2 className="text-2xl sm:text-[28px] leading-tight font-black italic uppercase tracking-tighter text-black font-['Arial_Black',sans-serif]">
                {category.cover.title}
              </h2>
              <p className="text-[13px] sm:text-[14px] text-gray-800 mt-2.5 font-medium max-w-[90%]">
                {category.cover.subtitle}
              </p>
            </motion.div>

            {/* Right Side: Products ("GET THE LOOK") */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-[55%] flex flex-col pt-0 lg:pt-8"
            >
              <h2 className="text-2xl sm:text-[28px] poppins-bold-italic uppercase tracking-tighter text-black font-['Arial_Black',sans-serif] mb-12 text-center lg:text-left">
                {category.lookTitle}
              </h2>

              <div className="grid grid-cols-2 gap-6 sm:gap-10">
                {category.products.map(product => (
                  <div key={product.id} className="flex flex-col items-center text-center group">
                    
                    {/* Clean Product Image Area without borders */}
                    <Link to={`/product/${product.id}`} className="w-full aspect-[4/5] flex items-center justify-center mb-5 relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out drop-shadow-md" 
                      />
                    </Link>

                    {/* Product Title */}
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-[13px] sm:text-[14px] font-medium text-black mb-1.5 hover:text-[#CB006B] transition-colors tracking-wide leading-relaxed">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Price */}
                    <span className="text-[15px] font-black text-black mb-3">
                      {product.price}
                    </span>

                    {/* Stars & Reviews */}
                    <div className="flex items-center gap-[2px] mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-black text-black' : 'fill-gray-200 text-gray-200'}`} 
                        />
                      ))}
                      <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium ml-1.5">{product.reviews} Reviews</span>
                    </div>

                    {/* Color Shades Matches screenshot style */}
                    {product.shades && product.shades.length > 0 && (
                      <div className="flex items-center justify-center gap-2 mt-auto">
                        {product.shades.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm hover:scale-125 cursor-pointer transition-transform" 
                            style={{ backgroundColor: color }}
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