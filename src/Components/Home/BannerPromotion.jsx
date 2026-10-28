import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BannerPromotion() {
  return (
    <section className="w-full bg-white overflow-hidden">
      
      <Link to="/shop?sub=Lips" className="block relative group w-full cursor-pointer">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[300px] md:h-[550px] lg:h-[650px] overflow-hidden"
        >
          {/* আপনার জেনারেট করা সলিড পিংক ব্যানার ছবিটি এখানে ব্যবহার করুন */}
          <img 
            src="https://res.cloudinary.com/wtbwxhmc/image/upload/v1793180291/Gemini_Generated_Image_4je9xr4je9xr4je9_w5rj3m.jpg" 
            alt="White Birch Beauty Waterproof Lipgloss" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          />
          
          {/* হোভার করলে ব্যানারের ওপর খুব হালকা একটি ডার্ক ইফেক্ট পড়বে, যা এটিকে ক্ল্যাসি করবে */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
        </motion.div>
        
      </Link>
    </section>
  );
}