import { useState } from 'react'; // ১. useState ইমপোর্ট করতে হবে
import { Outlet } from 'react-router-dom';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';
import CartDrawer from '../Cart/CartDrawer';

export default function Layout() {
  // ২. কার্ট ওপেন/ক্লোজ করার স্টেট ডিক্লেয়ার করতে হবে
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="grow">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* কার্ট ড্রয়ার */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}