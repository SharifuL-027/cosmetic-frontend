import { motion } from 'framer-motion';

export default function TrendingMarquee() {
  const images = [
    "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=500",
    "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=500",
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500",
    "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=500",
    "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?q=80&w=500",
  ];

  const marqueeImages = [...images, ...images, ...images, ...images];

  return (
    // ব্যাকগ্রাউন্ড হিসেবে একটি খুব সফট এবং প্রিমিয়াম পিংক কালার (#FDF2F8) ব্যবহার করা হয়েছে
    <section className="relative w-full py-32 bg-[#e9a6cb] overflow-hidden flex flex-col items-center justify-center border-y border-pink-100">
      
      {/* 3D Section Header */}
      <div className="absolute top-16 z-30 text-center">
        <h2 className="text-[#CB006B] text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-3">
          Trending Now
        </h2>
        {/* ব্যাকগ্রাউন্ড লাইট হওয়ায় মেইন টেক্সটটিকে কালো করা হয়েছে */}
        <h3 className="text-3xl md:text-5xl font-light text-black tracking-widest font-serif">
          THE <span className="italic text-[#CB006B]">GLAMOUR</span> ROLL
        </h3>
      </div>

      {/* 3D Marquee Container */}
      <div 
        className="relative w-full flex items-center mt-20"
        style={{ perspective: "1200px" }} 
      >
        {/* ফেড এফেক্টের কালারগুলো ব্ল্যাক থেকে পিংক করা হয়েছে যাতে ব্যাকগ্রাউন্ডের সাথে মিশে যায় */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-linear-to-r from-[#FDF2F8] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-linear-to-l from-[#FDF2F8] to-transparent z-20 pointer-events-none"></div>

        {/* The Moving 3D Track */}
        <motion.div
          className="flex gap-8 md:gap-12 w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 35
          }}
          style={{
            rotateX: "10deg", 
            rotateY: "-15deg", 
            rotateZ: "2deg", 
            transformStyle: "preserve-3d"
          }}
        >
          {marqueeImages.map((src, idx) => (
            <motion.div 
              key={idx} 
              className="relative w-48 md:w-72 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
              whileHover={{ 
                scale: 1.05, 
                translateZ: 80, 
                rotateY: 15 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                // লাইট পিংক ব্যাকগ্রাউন্ডের সাথে মানানসই করার জন্য শ্যাডোর ঘনত্ব অনেক কমানো হয়েছে
                boxShadow: "-15px 15px 30px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.5)"
              }}
            >
              {/* Product Image */}
              <img 
                src={src} 
                alt="Trending Beauty"
                // পিংক থিমে গ্রে-স্কেল না দিয়ে, ছবিতে হালকা অপাসিটি দিয়ে হোভারে ক্লিয়ার করা হয়েছে
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
              />
              
              {/* Glass/Glossy Reflection Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}