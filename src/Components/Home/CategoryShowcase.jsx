import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// আমাদের নতুন ডাটাবেস ক্যাটাগরি স্ট্রাকচার অনুযায়ী লিংকগুলো (query) সেট করা হয়েছে
const categories = [
  {
    id: 1,
    title: "Face",
    subtitle: "Flawless Base",
    query: "?sub=Face", // ডাটাবেসের sub: "Face" এর সাথে ম্যাচ করবে
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800",
  },
  {
    id: 2,
    title: "Lips",
    subtitle: "Bold & Beautiful",
    query: "?sub=Lips", // ডাটাবেসের sub: "Lips" এর সাথে ম্যাচ করবে
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800",
  },
  {
    id: 3,
    title: "Eyes",
    subtitle: "Mesmerizing Looks",
    query: "?sub=Eyes", // ডাটাবেসের sub: "Eyes" এর সাথে ম্যাচ করবে
    image: "https://images.unsplash.com/photo-1512496015851-a1c8d4f70b73?q=80&w=800",
  },
  {
    id: 4,
    title: "Skincare",
    subtitle: "Healthy Glow",
    query: "?main=Skincare", // ডাটাবেসের main: "Skincare" এর সাথে ম্যাচ করবে
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800",
  }
];

export default function CategoryShowcase() {
  return (
    <section className="w-full bg-[#F9F9F9] py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#CB006B] text-xs font-bold tracking-[0.2em] uppercase mb-4"
          >
            Shop By Category
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black italic tracking-tighter text-black uppercase font-['Arial_Black',sans-serif]"
          >
            Explore Essentials
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative h-[450px] w-full overflow-hidden bg-black cursor-pointer"
            >
              {/* Category Image */}
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
              />
              
              {/* Gradient Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Text & Button Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                <span className="text-[#CB006B] text-[10px] font-black uppercase tracking-[0.2em] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {category.subtitle}
                </span>
                <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase font-['Arial_Black',sans-serif] mb-4">
                  {category.title}
                </h3>
                
                {/* Dynamic Link to Shop Page */}
                <Link 
                  to={`/shop${category.query}`} 
                  className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest hover:text-[#CB006B] transition-colors w-fit"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}