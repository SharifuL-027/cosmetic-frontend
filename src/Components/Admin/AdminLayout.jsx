import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, PlusCircle, FolderPlus, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // বর্তমান URL ট্র্যাক করার জন্য
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // মোবাইলে সাইডবার কন্ট্রোল করার জন্য

  const handleLogout = () => {
    localStorage.removeItem('wbb_user');
    navigate('/login');
  };

  // মেনু আইটেমগুলোর একটি অ্যারে বানালাম, যাতে কোড ক্লিন থাকে এবং Active state সহজে কাজ করে
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: FolderPlus },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Mobile Sidebar Overlay (কালো শ্যাডো যা মোবাইলে সাইডবার ওপেন হলে পেছনে দেখাবে) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fully Responsive */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-[#111111] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Title & Close Button for Mobile */}
          <div className="p-6 flex items-center justify-between border-b border-gray-800">
            <h2 className="text-3xl font-black italic tracking-tighter text-white font-['Arial_Black',sans-serif]">
              WBB <span className="text-[#CB006B]">ADMIN</span>
            </h2>
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Nav Links (Dynamic Active State) */}
          <nav className="px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              // বর্তমান URL এর সাথে মেনুর URL মিলে গেলে active ধরবে
              const isActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)} // মোবাইলে ক্লিক করলে মেনু বন্ধ হয়ে যাবে
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors rounded ${
                    isActive 
                      ? 'bg-[#CB006B] text-white' // Active হলে পিংক ব্যাকগ্রাউন্ড
                      : 'text-gray-400 hover:bg-[#CB006B] hover:text-white' // Active না হলে নরমাল
                  }`}
                >
                  <item.icon className="w-5 h-5" /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Back to Website & Logout */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold tracking-widest uppercase bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold tracking-widest uppercase text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header for Admin */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-8 border-b border-gray-200 shrink-0">
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-[#CB006B] transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Admin Profile Area */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 rounded-full bg-[#CB006B] flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-sm font-bold hidden sm:block">Admin User</span>
          </div>
        </header>

        {/* Dashboard Content gets rendered here */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[#F9F9F9]">
          <Outlet />
        </div>
      </main>

    </div>
  );
}