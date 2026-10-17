import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const makeupCategories = {
  Face: ['Face Palettes', 'Foundation', 'Tinted Moisturiser', 'Primer', 'Concealer', 'Blusher'],
  Eyes: ['Primer & Brightener', 'Eyeshadows', 'Eyeliner', 'Mascara', 'False Eyelashes'],
  Lips: ['Lipstick', 'Lip Gloss', 'Lip Liner', 'Lip Balms'],
  Palettes: ['View All Palettes']
};

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // স্ক্রল ট্র্যাক করার সিম্পল লজিক
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Promotional Banner (এটি Sticky নয়, তাই স্ক্রল করলে স্বাভাবিকভাবেই উপরে হারিয়ে যাবে) */}
      <div className="w-full bg-[#CB006B] text-white text-[11px] sm:text-xs font-bold py-2.5 flex justify-center items-center tracking-[0.2em] relative z-40">
        <span className="uppercase hover:underline cursor-pointer hidden sm:inline">Shop Our New Arrivals</span>
        <span className="mx-4 font-normal text-white/70 hidden sm:inline">|</span>
        <span className="uppercase hover:underline cursor-pointer">Our Advent Calendar Is Back</span>
      </div>

      {/* Main Navbar (এটি Sticky, তাই স্ক্রল করলে স্ক্রিনের উপরে আটকে থাকবে) */}
      <header className={`w-full sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'}`}>
            
            {/* Mobile Menu Button */}
            <div className="flex lg:hidden flex-1">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-black hover:text-[#C27B8A] transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link to="/" className="text-4xl lg:text-5xl font-black italic tracking-tighter text-black font-['Arial_Black',sans-serif] hover:scale-105 transition-transform duration-300">
                WBB
              </Link>
            </div>

            {/* Desktop Navigation Links (Right Aligned) */}
            <div className="hidden lg:flex flex-1 justify-end h-full items-center gap-10">
              
              {/* Nav Links */}
              <nav className="flex space-x-8 h-full items-center">
                <Link to="/shop?category=new" className="text-[13px] font-bold text-black hover:text-[#C27B8A] transition-colors tracking-widest uppercase">
                  New
                </Link>
                
                {/* Makeup - Mega Menu Trigger */}
                <div 
                  className="h-full flex items-center cursor-pointer group"
                  onMouseEnter={() => setActiveMenu('makeup')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link to="/shop?category=makeup" className="text-[13px] font-bold text-black group-hover:text-[#C27B8A] transition-colors tracking-widest uppercase flex items-center gap-1">
                    Makeup <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>

                  {/* Framer Motion Mega Menu Dropdown */}
                  <AnimatePresence>
                    {activeMenu === 'makeup' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        // 'top-full' দেওয়ার ফলে Navbar ছোট/বড় যাই হোক না কেন, ড্রপডাউন ঠিক নিচেই আসবে
                        className="absolute top-full left-0 w-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 py-10 z-50"
                      >
                        <div className="max-w-[1200px] mx-auto grid grid-cols-4 gap-8 px-8">
                          {Object.entries(makeupCategories).map(([title, items]) => (
                            <div key={title} className="flex flex-col">
                              <h3 className="text-base font-black italic tracking-tight mb-4 uppercase">{title}</h3>
                              <ul className="space-y-3">
                                {items.map(item => (
                                  <li key={item}>
                                    <Link to={`/shop?category=${item.toLowerCase().replace(/ /g, '-')}`} className="text-[14px] text-gray-600 hover:text-[#C27B8A] transition-colors">
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/shop?category=skincare" className="text-[13px] font-bold text-black hover:text-[#C27B8A] transition-colors tracking-widest uppercase">
                  Skincare
                </Link>
                <Link to="/shop?category=tools" className="text-[13px] font-bold text-black hover:text-[#C27B8A] transition-colors tracking-widest uppercase">
                  Tools & Accessories
                </Link>
              </nav>

              {/* Right Divider */}
              <div className="h-6 w-px bg-gray-200"></div>

              {/* Icons */}
              <div className="flex items-center space-x-6">
                <button className="text-black hover:text-[#C27B8A] hover:scale-110 transition-all duration-200">
                  <Search className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button className="text-black hover:text-[#C27B8A] hover:scale-110 transition-all duration-200">
                  <User className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button className="text-black hover:text-[#C27B8A] hover:scale-110 transition-all duration-200 relative group">
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  <span className="absolute -top-1.5 -right-2 bg-[#CB006B] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    0
                  </span>
                </button>
              </div>
              
            </div>

            {/* Mobile Right Icons */}
            <div className="flex lg:hidden flex-1 justify-end items-center space-x-5">
              <button className="text-black hover:text-[#C27B8A] transition-colors">
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button className="text-black hover:text-[#C27B8A] transition-colors relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                <span className="absolute -top-1 -right-1.5 bg-[#CB006B] text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <span className="text-3xl font-black italic tracking-tighter">WBB</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-black hover:text-[#C27B8A]">
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="flex flex-col p-6 space-y-6 overflow-y-auto">
                {['New', 'Makeup', 'Skincare', 'Tools & Accessories', 'Gifting'].map((item) => (
                  <Link 
                    key={item} 
                    to={`/shop?category=${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-bold text-black border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center hover:text-[#C27B8A] transition-colors"
                  >
                    {item}
                    <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}