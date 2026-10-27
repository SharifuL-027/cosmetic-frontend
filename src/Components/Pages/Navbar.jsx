import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// নতুন ডাটাবেস স্ট্রাকচার অনুযায়ী মেগামেনুর ডাটা
const makeupMenuData = {
  mainCategory: "Makeup",
  columns: [
    {
      title: "Face",
      items: ["Face Palettes", "Foundation", "Tinted Moisturiser", "Primer", "Concealer", "Blusher"]
    },
    {
      title: "Eyes",
      items: ["Primer & Brightener", "Eyeshadows", "Eyeliner", "Mascara", "False Eyelashes"]
    },
    {
      title: "Lips",
      items: ["Lipstick", "Lip Gloss", "Lip Liner", "Lip Balms"]
    },
    {
      title: "Palettes",
      items: ["View All Palettes"]
    }
  ]
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
      {/* Promotional Banner */}
      <div className="w-full bg-[#CB006B] text-white text-[11px] sm:text-xs font-bold py-2.5 flex justify-center items-center tracking-[0.2em] relative z-40">
        <span className="uppercase hover:underline cursor-pointer hidden sm:inline">Shop Our New Arrivals</span>
        <span className="mx-4 font-normal text-white/70 hidden sm:inline">|</span>
        <span className="uppercase hover:underline cursor-pointer">Our Advent Calendar Is Back</span>
      </div>

      {/* Main Navbar */}
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
              <a href="/" className="hover:scale-105 transition-transform duration-300 block">
                <img 
                  src="https://res.cloudinary.com/wtbwxhmc/image/upload/v1792236384/Elegant_WBB_Beauty_Emblem-removebg-preview_yul9xd.png" 
                  alt="WBB Logo" 
                  className="h-10 lg:h-20 w-auto" 
                />
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex flex-1 justify-end h-full items-center gap-10">
              
              {/* Nav Links */}
              <nav className="flex space-x-8 h-full items-center">
                <Link to="/shop?badge=new" className="text-[13px] font-bold text-black hover:text-[#C27B8A] transition-colors tracking-widest uppercase">
                  New
                </Link>
                
                {/* Makeup - Mega Menu Trigger */}
                <div 
                  className="h-full flex items-center cursor-pointer group relative"
                  onMouseEnter={() => setActiveMenu('makeup')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link to="/shop?main=Makeup" className="text-[13px] font-bold text-black group-hover:text-[#C27B8A] transition-colors tracking-widest uppercase flex items-center gap-1">
                    Makeup <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {activeMenu === 'makeup' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-t-[3px] border-[#CB006B] py-10 z-50"
                      >
                        <div className="grid grid-cols-4 gap-8 px-8">
                          {makeupMenuData.columns.map((col, idx) => (
                            <div key={idx} className="flex flex-col">
                              {/* Sub Category Title (e.g. Face) */}
                              <h3 className="text-base font-black italic tracking-tight mb-4 uppercase border-b border-gray-100 pb-2 text-black">
                                {col.title}
                              </h3>
                              <ul className="space-y-3">
                                {/* Sub Child Items (e.g. Foundation) */}
                                {col.items.map(item => (
                                  <li key={item}>
                                    <Link 
                                      to={`/shop?main=${makeupMenuData.mainCategory}&sub=${col.title}&subChild=${item}`} 
                                      className="text-[14px] text-gray-600 hover:text-[#C27B8A] hover:pl-2 transition-all duration-300 block"
                                    >
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

                <Link to="/shop?main=Skincare" className="text-[13px] font-bold text-black hover:text-[#C27B8A] transition-colors tracking-widest uppercase">
                  Skincare
                </Link>
                <Link to="/shop?main=Tools" className="text-[13px] font-bold text-black hover:text-[#C27B8A] transition-colors tracking-widest uppercase">
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
              className="fixed inset-0 bg-white z-60 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <span className="text-3xl font-black italic tracking-tighter">WBB</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-black hover:text-[#C27B8A]">
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="flex flex-col p-6 space-y-6 overflow-y-auto">
                <Link to="/shop?badge=new" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-black border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center hover:text-[#C27B8A] transition-colors">
                  New <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                </Link>
                <Link to="/shop?main=Makeup" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-black border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center hover:text-[#C27B8A] transition-colors">
                  Makeup <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                </Link>
                <Link to="/shop?main=Skincare" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-black border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center hover:text-[#C27B8A] transition-colors">
                  Skincare <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                </Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-[#CB006B] border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center">
                  Shop All <ChevronDown className="w-5 h-5 text-[#CB006B] -rotate-90" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}