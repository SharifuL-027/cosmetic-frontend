import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Package, MapPin, Edit2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে ইউজারের ডাটা লোড করা
    const userInfo = localStorage.getItem('wbb_user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('wbb_user');
    navigate('/login');
  };

  if (!user) return null; // ডাটা লোড হওয়ার আগে কিছু দেখাবে না

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 min-h-[60vh]">
      
      {/* Header */}
      <div className="mb-10 text-center md:text-left border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-black mb-2 font-['Arial_Black',sans-serif]">
            My Account
          </h1>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            Manage your personal information and orders
          </p>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 border border-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Personal Information Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-[#F9F9F9] p-8 border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-black">
              <User className="w-5 h-5 text-[#CB006B]" /> Profile Details
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-bold text-black uppercase tracking-wider">{user.name || 'WBB Member'}</p>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-700">{user.email}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest mt-1 ${user.role === 'admin' ? 'bg-[#CB006B] text-white' : 'bg-black text-white'}`}>
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>

              {/* Edit Profile Button (Dummy for now) */}
              <button className="w-full mt-4 bg-transparent border border-black hover:bg-black text-black hover:text-white py-3 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Order History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white border border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-black">
                <ShoppingBag className="w-5 h-5 text-[#CB006B]" /> Order History
              </h2>
            </div>

            {/* Empty State for Orders */}
            <div className="py-16 text-center bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center">
              <Package className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-sm font-black uppercase tracking-widest text-black mb-2">No Orders Yet</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-6 font-bold">
                You haven't placed any orders with us.
              </p>
              <button 
                onClick={() => navigate('/shop')}
                className="bg-[#CB006B] hover:bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Start Shopping
              </button>
            </div>
            
            {/* 
              Future Order List Layout (Commented for now)
              You can map your backend orders here later
            */}
          </div>

          {/* Saved Addresses Section */}
          <div className="bg-white border border-gray-100 p-8 shadow-sm mt-8">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-black">
              <MapPin className="w-5 h-5 text-[#CB006B]" /> Saved Addresses
            </h2>
            <div className="text-center py-8 bg-gray-50">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">No saved addresses found.</p>
              <button className="mt-4 text-[#CB006B] hover:text-black text-[10px] font-bold uppercase tracking-widest underline transition-colors">
                + Add New Address
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}