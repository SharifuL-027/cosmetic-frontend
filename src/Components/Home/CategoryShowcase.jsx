import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    title: "Face",
    query: "?sub=Face",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800",
  },
  {
    id: 2,
    title: "Lips",
    query: "?sub=Lips",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800",
  },
  {
    id: 3,
    title: "Eyes",
    query: "?sub=Eyes",
    image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1793166532/image.png_3065c075_2K_twbbgn.jpg",
  },
  {
    id: 4,
    title: "Skincare",
    query: "?main=Skincare",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800",
  }
];

export default function CategoryShowcase() {
  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-400 mx-auto">
        
        {/* Simple & Elegant Header */}
        <div className="flex justify-center mb-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl poppins-bold-italic tracking-tighter uppercase text-black"
            
          >
            Shop By <span className=" text-[#CB006B]">Category</span>
          </motion.h2>
        </div>

        {/* Categories Grid (Clean Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link 
                to={`/shop${category.query}`} 
                className="group flex flex-col items-center cursor-pointer w-full"
              >
                {/* Clean Square Image */}
                <div className="w-full aspect-square overflow-hidden mb-4 bg-gray-50">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                
                {/* Category Title Below Image */}
                <h3 className="text-xs md:text-[13px] text-black font-medium tracking-wide">
                  {category.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}