import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FoundationBanner() {
  return (
    <section className="w-full bg-white overflow-hidden">
      {/* 
        Link component-এর মাধ্যমে /shop?sub=Foundation-এ রিডাইরেক্ট করা হচ্ছে।
        ব্যানারে ক্লিক করলেই সরাসরি Foundation ক্যাটাগরির প্রোডাক্টগুলো ওপেন হবে।
      */}
      <Link to="/shop?sub=Foundation" className="block relative group w-full cursor-pointer">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full aspect-video md:aspect-21/9 overflow-hidden"
        >
          {/* Foundation Banner Image (Apnar image url/path ekhane boshaben) */}
          <img 
            src="https://res.cloudinary.com/wtbwxhmc/image/upload/v1793182470/Gemini_Generated_Image_f5a2oef5a2oef5a2_dwdm2s.jpg" 
            alt="Flawless Foundation Collection" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          />
          
          {/* Subtle Hover Dark Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
        </motion.div>
        
      </Link>
    </section>
  );
}