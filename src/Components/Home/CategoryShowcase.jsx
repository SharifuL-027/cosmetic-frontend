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
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] mx-auto">
        
        {categoryData.map((category, index) => (
          <div 
            key={category.id} 
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''} mb-24 last:mb-0`}
          >
            
            {/* Left Side: Cover Image (Strictly 1:1) & Info */}
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col items-center text-center"
            >
              {/* Image Container - aspect-square ensures 1:1 on ALL devices */}
              <div className="w-full aspect-square overflow-hidden mb-6 group cursor-pointer relative">
                <img 
                  src={category.cover.image} 
                  alt={category.cover.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              <h2 className="text-[28px] md:text-[32px] leading-none font-black italic uppercase tracking-tighter text-black font-['Arial_Black',sans-serif]">
                {category.cover.title}
              </h2>
              <p className="text-[14px] md:text-[15px] text-black mt-2.5 font-medium max-w-sm">
                {category.cover.subtitle}
              </p>
            </motion.div>

            {/* Right Side: Products ("GET THE LOOK") */}
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex flex-col"
            >
              <h2 className="text-[22px] md:text-[26px] font-black italic uppercase tracking-tighter text-black font-['Arial_Black',sans-serif] mb-8 text-center lg:text-left">
                {category.lookTitle}
              </h2>

              <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                {category.products.map(product => (
                  <div key={product.id} className="flex flex-col items-center text-center group cursor-pointer">
                    
                    {/* Product Image - Light gray bg to make transparent products pop */}
                    <Link to={`/product/${product.id}`} className="w-full aspect-square bg-[#F9F9F9] flex items-center justify-center p-6 mb-4 overflow-hidden relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm" 
                      />
                    </Link>

                    {/* Product Info */}
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-[13px] sm:text-[14px] font-bold text-black mb-1.5 hover:text-[#CB006B] transition-colors tracking-wide leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <span className="text-[14px] font-black text-black mb-2.5">
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
                      <span className="text-[11px] text-gray-500 font-medium ml-1.5">{product.reviews} Reviews</span>
                    </div>

                    {/* Color Shades */}
                    {product.shades && product.shades.length > 0 && (
                      <div className="flex items-center justify-center gap-2 mt-auto">
                        {product.shades.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-[18px] h-[18px] rounded-full shadow-sm hover:scale-110 cursor-pointer transition-transform" 
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