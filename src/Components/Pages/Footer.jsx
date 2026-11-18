import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Phone } from 'lucide-react';

// সোশ্যাল মিডিয়ার জন্য কাস্টম SVG আইকন
const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 7.1A2.5 2.5 0 0 1 5 4.6h14a2.5 2.5 0 0 1 2.5 2.5v9.8a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5V7.1z" />
    <path d="m10 15 5-3-5-3v6z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F9F9F9] text-black pt-14 sm:pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t-[6px] border-[#CB006B]">
      <div className="max-w-350 mx-auto">
        

        {/* Middle Section: Mobile 2-Column & Desktop 4-Column Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-8 mb-12 sm:mb-16">
          
          {/* Column 1: Brand (মোবাইলে ফুল উইডথ, ডেস্কটপে ১ কলাম) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col">
            <Link to="/" className="mb-2 inline-block hover:scale-105 transition-transform duration-300 origin-left">
              <img 
                src="https://res.cloudinary.com/wtbwxhmc/image/upload/v1792236384/Elegant_WBB_Beauty_Emblem-removebg-preview_yul9xd.png"
                alt="WBB Logo" 
                className="h-14 sm:h-16 md:h-20 w-auto object-contain" 
              />
            </Link>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 pr-2 sm:pr-4">
              Empowering your everyday beauty. Discover high-quality, cruelty-free cosmetics designed to make you glow your own way.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 sm:gap-5">
              <a href="#" aria-label="Instagram" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Shop (মোবাইলে বাম কলাম) */}
          <div className="col-span-1 flex flex-col">
            <h4 className="text-base sm:text-lg font-black italic tracking-tighter uppercase mb-4 sm:mb-6 text-black font-['Arial_Black',sans-serif]">
              Shop
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {['New Arrivals', 'Face Makeup', 'Eye Cosmetics', 'Lip Products', 'Skincare', 'Tools & Accessories'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?category=${item.toLowerCase()}`} className="text-gray-600 text-xs sm:text-sm font-medium hover:text-[#CB006B] hover:pl-1.5 transition-all duration-300 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care (মোবাইলে ডান কলাম — Shop-এর ঠিক পাশে) */}
          <div className="col-span-1 flex flex-col">
            <h4 className="text-base sm:text-lg font-black italic tracking-tighter uppercase mb-4 sm:mb-6 text-black font-['Arial_Black',sans-serif]">
              Customer Care
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {['Track Order', 'Delivery & Shipping', 'Returns & Refunds', 'FAQs', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 text-xs sm:text-sm font-medium hover:text-[#CB006B] hover:pl-1.5 transition-all duration-300 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us (মোবাইলে ফুল উইডথ, ডেস্কটপে ১ কলাম) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col pt-4 border-t border-gray-200 lg:pt-0 lg:border-t-0">
            <h4 className="text-base sm:text-lg font-black italic tracking-tighter uppercase mb-4 sm:mb-6 text-black font-['Arial_Black',sans-serif]">
              Contact Us
            </h4>
            <ul className="space-y-4 sm:space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#CB006B] shrink-0 mt-0.5" />
                <span className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  123 Beauty Avenue,<br className="hidden lg:inline" /> London, UK, W1D 3QU
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#CB006B] shrink-0" />
                <span className="text-gray-600 text-xs sm:text-sm">
                  +44 20 7123 4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#CB006B] shrink-0" />
                <a href="mailto:support@wbb.com" className="text-gray-600 text-xs sm:text-sm hover:text-[#CB006B] transition-colors">
                  support@wbb.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-200 gap-3 md:gap-0">
          <p className="text-gray-500 text-xs sm:text-[13px] font-medium text-center md:text-left">
            &copy; {currentYear} WBB Cosmetics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-xs sm:text-[13px] font-medium hover:text-black cursor-pointer transition-colors">
              Europe (EUR €)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}