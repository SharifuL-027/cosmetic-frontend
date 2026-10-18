import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Phone } from 'lucide-react';

// সোশ্যাল মিডিয়ার জন্য কাস্টম SVG আইকন (কালার আপডেট করা হয়েছে)
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
    // ব্যাকগ্রাউন্ড সাদা এবং টেক্সট কালো করা হয়েছে
    <footer className="w-full bg-[#F9F9F9] text-black pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t-[6px] border-[#CB006B]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top Section: Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-center border-b border-gray-200 pb-16 mb-16 gap-10">
          <div className="text-center lg:text-left max-w-lg">
            <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase font-['Arial_Black',sans-serif] mb-3 text-black">
              Join The VIP List
            </h3>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Subscribe to get 10% off your first order, exclusive offers, and the latest beauty trends straight to your inbox.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 sm:gap-0 sm:max-w-md">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full sm:w-72 px-5 py-4 bg-white border border-gray-300 focus:outline-none focus:border-[#CB006B] text-sm text-black placeholder-gray-400 transition-colors"
            />
            <button className="bg-[#CB006B] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle Section: Links & Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <a href="/" className="mb-2 inline-block hover:scale-105 transition-transform duration-300 origin-left">
              <img 
                src="https://res.cloudinary.com/wtbwxhmc/image/upload/v1792236384/Elegant_WBB_Beauty_Emblem-removebg-preview_yul9xd.png"
                alt="WBB Logo" 
                className="h-15 md:h-20 w-auto object-contain" 
              />
            </a>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 pr-4">
              Empowering your everyday beauty. Discover high-quality, cruelty-free cosmetics designed to make you glow your own way.
            </p>
            {/* Social Icons - Light theme specific */}
            <div className="flex items-center gap-5">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <InstagramIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <FacebookIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <TwitterIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-black flex items-center justify-center hover:bg-[#CB006B] hover:text-white hover:-translate-y-1 transition-all duration-300">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black italic tracking-tighter uppercase mb-6 text-black font-['Arial_Black',sans-serif]">
              Shop
            </h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Face Makeup', 'Eye Cosmetics', 'Lip Products', 'Skincare', 'Tools & Accessories'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?category=${item.toLowerCase()}`} className="text-gray-600 text-sm font-medium hover:text-[#CB006B] hover:pl-2 transition-all duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black italic tracking-tighter uppercase mb-6 text-black font-['Arial_Black',sans-serif]">
              Customer Care
            </h4>
            <ul className="space-y-4">
              {['Track Order', 'Delivery & Shipping', 'Returns & Refunds', 'FAQs', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 text-sm font-medium hover:text-[#CB006B] hover:pl-2 transition-all duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col">
            <h4 className="text-lg font-black italic tracking-tighter uppercase mb-6 text-black font-['Arial_Black',sans-serif]">
              Contact Us
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#CB006B] shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm leading-relaxed">
                  123 Beauty Avenue,<br />
                  London, UK, W1D 3QU
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#CB006B] shrink-0" />
                <span className="text-gray-600 text-sm">
                  +44 20 7123 4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#CB006B] shrink-0" />
                <a href="mailto:support@wbb.com" className="text-gray-600 text-sm hover:text-[#CB006B] transition-colors">
                  support@wbb.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 gap-4 md:gap-0">
          <p className="text-gray-500 text-[13px] font-medium text-center md:text-left">
            &copy; {currentYear} WBB Cosmetics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-[13px] font-medium hover:text-black cursor-pointer transition-colors">United Kingdom (GBP £)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}