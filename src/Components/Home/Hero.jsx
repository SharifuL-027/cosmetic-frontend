import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1792224591/Cosmetics_arranged_on_vanity_2K_20261017140724_kb5s9a.jpg",
    preTitle: "THE COUNTDOWN IS ON",
    title: "GLOW YOUR OWN WAY",
    subtitle: "Ready, Set, Glow! Discover your daily beauty surprises.",
    buttonText: "SHOP NOW",
    link: "/shop?category=makeup"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1792229508/image.png_2K_20261017152946_c8jojw.jpg",
    preTitle: "JUST LANDED",
    title: "NEW ARRIVALS",
    subtitle: "Discover the latest trends and upgrade your routine.",
    buttonText: "DISCOVER MORE",
    link: "/shop?category=new"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/wtbwxhmc/image/upload/v1792231631/image.png_2K_20261017160340_gy7aw4.jpg",
    preTitle: "DAILY ESSENTIALS",
    title: "EVERYDAY SKINCARE",
    subtitle: "Nurture your natural beauty with our gentle formulas.",
    buttonText: "SHOP SKINCARE",
    link: "/shop?category=skincare"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const getIndex = (index) => {
    if (index < 0) return slides.length - 1;
    if (index >= slides.length) return 0;
    return index;
  };

  return (
    <div className="w-full bg-white py-6 overflow-hidden relative group">
      
      {/* Slider Track */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex justify-center items-center overflow-visible">
        
        {[-1, 0, 1].map((offset) => {
          const slideIndex = getIndex(current + offset);
          const slide = slides[slideIndex];
          
          return (
            <motion.div
              key={`${slide.id}-${current}`}
              className="absolute w-[85%] sm:w-[90%] h-full rounded-xl overflow-hidden shadow-sm"
              initial={{ 
                x: `${(offset + direction) * 102}%`, 
                scale: 0.98,
                opacity: 0 
              }}
              animate={{
                x: `${offset * 102}%`,
                scale: offset === 0 ? 1 : 0.98,
                opacity: 1,
                zIndex: offset === 0 ? 10 : 0
              }}
              exit={{ 
                x: `${(offset - direction) * 102}%`, 
                scale: 0.98,
                opacity: 0 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Background Image with Smooth Zoom */}
              <motion.div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
                // ছবিটা যখন সামনে (offset === 0) আসবে, তখন ধীরে ধীরে 1.1 গুণ বড় হবে
                initial={{ scale: 1 }}
                animate={{ scale: offset === 0 ? 1.1 : 1 }}
                transition={{ duration: 6, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
              </motion.div>

              {/* Content - Centered */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: offset === 0 ? 1 : 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-white text-[10px] sm:text-xs font-bold tracking-widest mb-3 uppercase drop-shadow-md"
                >
                  {slide.preTitle}
                </motion.h3>
                
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: offset === 0 ? 1 : 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-white text-4xl md:text-5xl lg:text-[64px] leading-none font-black italic tracking-tighter mb-4 uppercase max-w-3xl font-['Arial_Black',sans-serif] drop-shadow-lg"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: offset === 0 ? 1 : 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-white text-sm md:text-base font-medium mb-8 drop-shadow-md"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: offset === 0 ? 1 : 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link 
                    to={slide.link}
                    className="bg-[#CB006B] text-white px-8 py-3.5 rounded-full font-bold tracking-widest text-[11px] sm:text-xs hover:bg-white hover:text-black transition-colors duration-300 uppercase inline-block shadow-lg"
                  >
                    {slide.buttonText}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`transition-all duration-300 rounded-full ${
              current === index ? 'bg-black w-8 h-1.5' : 'bg-gray-300 w-1.5 h-1.5 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-md"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-md"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}