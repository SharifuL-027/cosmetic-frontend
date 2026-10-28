import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  // লোকাল স্টোরেজ থেকে ইউজারের ডাটা চেক করা
  useEffect(() => {
    const userInfo = localStorage.getItem('wbb_user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // স্ক্রল ট্র্যাক করা
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ক্যাটাগরি ফেচ করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);
  return (
    <>
      <div className="w-full bg-[#f50083] text-white text-[11px] sm:text-xs font-bold py-2.5 flex justify-center items-center tracking-[0.2em] relative z-40">
        <span className="uppercase hover:underline cursor-pointer hidden sm:inline">Shop Our New Arrivals</span>
        <span className="mx-4 font-normal text-white/70 hidden sm:inline">|</span>
      </div>

      <header className={`w-full sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'}`}>
            
            <div className="flex lg:hidden flex-1">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-black hover:text-[#C27B8A] transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link to="/" className="hover:scale-105 transition-transform duration-300 block">
                <img 
                  src="https://res.cloudinary.com/wtbwxhmc/image/upload/v1792236384/Elegant_WBB_Beauty_Emblem-removebg-preview_yul9xd.png" 
                  alt="WBB Logo" 
                  className="h-10 lg:h-20 w-auto" 
                />
              </Link>
            </div>

            <div className="hidden lg:flex flex-1 justify-end h-full items-center gap-10">
              <nav className="flex space-x-8 h-full items-center">
                <Link to="/shop?badge=new" className="text-[13px] poppins-bold text-black hover:text-[#db5875] transition-colors tracking-widest uppercase">
                  New
                </Link>
                
                {categories.map((category) => (
                  <div 
                    key={category._id}
                    className="h-full flex items-center cursor-pointer group relative"
                    onMouseEnter={() => setActiveMenu(category.name)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <Link to={`/shop?main=${category.name}`} className="text-[13px] poppins-bold text-black group-hover:text-[#df5c78] transition-colors tracking-normal uppercase flex items-center gap-1">
                      {category.name} 
                      {category.subCategories && category.subCategories.length > 0 && (
                        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>

                    <AnimatePresence>
                      {activeMenu === category.name && category.subCategories && category.subCategories.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-t-[3px] border-[#CB006B] py-10 z-50"
                        >
                          <div className="grid grid-cols-4 gap-8 px-8">
                            {category.subCategories.map((sub, idx) => (
                              <div key={idx} className="flex flex-col">
                                
                                {/* এই জায়গাটা আপডেট করা হয়েছে। এখন সাব-ক্যাটাগরির নামে ক্লিক করা যাবে */}
                                <Link 
                                  to={`/shop?main=${category.name}&sub=${sub.name}`}
                                  className="text-sm font-black italic tracking-tight mb-4 uppercase poppins-semibold-italic border-b border-gray-100 pb-2 text-black hover:text-[#CB006B] transition-colors block w-full text-left"
                                >
                                  {sub.name}
                                </Link>

                                <ul className="space-y-3">
                                  {sub.subChildren?.map(child => (
                                    <li key={child}>
                                      <Link 
                                        to={`/shop?main=${category.name}&sub=${sub.name}&subChild=${child}`} 
                                        className="text-[14px] poppins-normal text-gray-700 hover:text-[#da3d5f] hover:pl-2 transition-all duration-300 block"
                                      >
                                        {child}
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
                ))}
              </nav>

              <div className="h-6 w-px bg-gray-200"></div>

              <div className="flex items-center space-x-6">
                <button className="text-black hover:text-[#C27B8A] hover:scale-110 transition-all duration-200">
                  <Search className="w-5 h-5 stroke-[1.5]" />
                </button>
                {/* Dynamic User Icon Route */}
<Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/profile') : '/login'} className="text-black hover:text-[#C27B8A] hover:scale-110 transition-all duration-200">
  <User className="w-5 h-5 stroke-[1.5]" />
</Link>
                <button className="text-black hover:text-[#C27B8A] hover:scale-110 transition-all duration-200 relative group">
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  <span className="absolute -top-1.5 -right-2 bg-[#CB006B] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    0
                  </span>
                </button>
              </div>
              
            </div>

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
              
              {/* Menu Links */}
              <div className="flex flex-col p-6 space-y-6 overflow-y-auto flex-1">
                <Link to="/shop?badge=new" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-black border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center hover:text-[#C27B8A] transition-colors">
                  New
                </Link>
                
                {categories.map((category) => (
                  <Link 
                    key={category._id}
                    to={`/shop?main=${category.name}`} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-xl font-bold text-black border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center hover:text-[#C27B8A] transition-colors"
                  >
                    {category.name} <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
                  </Link>
                ))}

                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-[#CB006B] border-b border-gray-100 pb-4 uppercase tracking-wider flex justify-between items-center">
                  Shop All <ChevronDown className="w-5 h-5 text-[#CB006B] -rotate-90" />
                </Link>
              </div>

              {/* Mobile Menu Footer with User Info (এই অংশটি যোগ করা হয়েছে) */}
              <div className="p-6 bg-gray-50 mt-auto border-t border-gray-100">
                <Link 
                  to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/profile') : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-black font-bold uppercase tracking-widest text-sm"
                >
                  <UserCircle className="w-6 h-6 text-[#CB006B]" />
                  {user ? (user.role === 'admin' ? 'Admin Panel' : 'My Account') : 'Sign In / Register'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}