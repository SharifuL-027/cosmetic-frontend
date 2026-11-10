import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cartItems, cartTotal, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // কাস্টমারের ইনফরমেশন রাখার স্টেট
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  // ফর্ম ফিল্ড আপডেট করার ফাংশন
  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  // অর্ডার সাবমিট করার মেইন ফাংশন
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    // ব্যাকএন্ডের জন্য ডেটা রেডি করা
    const orderData = {
      customerInfo,
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image || item.images?.[0] || "https://via.placeholder.com/150",
        price: item.price,
        product: item._id
      })),
      totalPrice: cartTotal,
      paymentMethod: "Cash on Delivery"
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // অর্ডার সাকসেস হলে কার্ট ক্লিয়ার করা
      cartItems.forEach(item => removeFromCart(item._id));
      
      setSuccess(true);
      setLoading(false);
      
      // ৩ সেকেন্ড পর হোম পেজে পাঠিয়ে দেওয়া
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // যদি অর্ডার প্লেস হয়ে যায়, তবে সাকসেস মেসেজ দেখাবো
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-10 shadow-lg text-center rounded-lg border border-gray-100"
        >
          <CheckCircle2 className="w-20 h-20 text-[#CB006B] mx-auto mb-6" />
          <h2 className="text-3xl poppins-bold text-black uppercase tracking-widest mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8">Thank you for shopping with WBB.</p>
          <p className="text-sm font-bold animate-pulse text-[#CB006B]">Redirecting to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Shipping Information Form */}
        <div className="flex-1 bg-white p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl poppins-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">
            Shipping Information
          </h2>
          
          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                <input required type="text" name="name" value={customerInfo.name} onChange={handleChange} className="w-full border border-gray-200 p-3 focus:outline-none focus:border-[#CB006B] transition-colors bg-gray-50/50 text-sm" placeholder="e.g. Shariful Islam Hridoy" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input required type="email" name="email" value={customerInfo.email} onChange={handleChange} className="w-full border border-gray-200 p-3 focus:outline-none focus:border-[#CB006B] transition-colors bg-gray-50/50 text-sm" placeholder="hridoy@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                <input required type="tel" name="phone" value={customerInfo.phone} onChange={handleChange} className="w-full border border-gray-200 p-3 focus:outline-none focus:border-[#CB006B] transition-colors bg-gray-50/50 text-sm" placeholder="017XXXXXXXX" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                <input required type="text" name="postalCode" value={customerInfo.postalCode} onChange={handleChange} className="w-full border border-gray-200 p-3 focus:outline-none focus:border-[#CB006B] transition-colors bg-gray-50/50 text-sm" placeholder="e.g. 1209" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Street Address</label>
              <input required type="text" name="address" value={customerInfo.address} onChange={handleChange} className="w-full border border-gray-200 p-3 focus:outline-none focus:border-[#CB006B] transition-colors bg-gray-50/50 text-sm" placeholder="e.g. Dhanmondi, 32" />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">City</label>
              <input required type="text" name="city" value={customerInfo.city} onChange={handleChange} className="w-full border border-gray-200 p-3 focus:outline-none focus:border-[#CB006B] transition-colors bg-gray-50/50 text-sm" placeholder="e.g. Dhaka" />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || cartItems.length === 0}
              className="w-full mt-6 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#CB006B] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Place Order (Cash on Delivery)"}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white p-8 border border-gray-100 shadow-sm sticky top-28">
            <h2 className="text-xl poppins-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">
              Order Summary
            </h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-6">
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Your cart is empty.</p>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <img src={item.image || item.images?.[0]} alt={item.name} className="w-16 h-16 object-cover bg-gray-50 border border-gray-100" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase tracking-widest line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold">৳{item.price * item.quantity}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-bold">৳{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Shipping</span>
                <span className="font-bold">Free</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-2">
                <span className="text-lg font-bold uppercase tracking-widest">Total</span>
                <span className="text-xl font-bold text-[#CB006B]">৳{cartTotal}</span>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}