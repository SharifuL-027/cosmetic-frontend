import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft, PlusCircle } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('wbb_user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] text-white flex flex-col justify-between">
        <div>
          {/* Logo / Title */}
          <div className="p-6 text-center border-b border-gray-800">
            <h2 className="text-3xl font-black italic tracking-tighter text-white font-['Arial_Black',sans-serif]">
              WBB <span className="text-[#CB006B]">ADMIN</span>
            </h2>
          </div>
          
          {/* Nav Links */}
          <nav className="px-4 py-6 space-y-2">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#CB006B] hover:text-white transition-colors rounded">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-gray-400 hover:bg-[#CB006B] hover:text-white transition-colors rounded">
              <Package className="w-5 h-5" /> Products
            </Link>
            <Link to="/admin/products/add" className="flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-gray-400 hover:bg-[#CB006B] hover:text-white transition-colors rounded">
              <PlusCircle className="w-5 h-5" /> Add Product
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-gray-400 hover:bg-[#CB006B] hover:text-white transition-colors rounded">
              <ShoppingCart className="w-5 h-5" /> Orders
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-gray-400 hover:bg-[#CB006B] hover:text-white transition-colors rounded">
              <Users className="w-5 h-5" /> Users
            </Link>
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header for Admin */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-end px-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#CB006B] flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-sm font-bold">Admin User</span>
          </div>
        </header>

        {/* Dashboard Content gets rendered here */}
        <div className="flex-1 overflow-auto p-8 bg-[#F9F9F9]">
          <Outlet />
        </div>
      </main>

    </div>
  );
}