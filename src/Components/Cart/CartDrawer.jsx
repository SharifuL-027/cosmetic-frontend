// src/components/CartDrawer.jsx
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { CartContext } from '../../context/CartContext'; 

export default function CartDrawer({ isOpen, onClose }) {
  // Context থেকে ডেটা এবং ফাংশনগুলো নিয়ে আসা
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[100] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h2 className="text-lg font-bold uppercase tracking-widest text-black">
                  Your Cart <span className="text-gray-400 text-sm ml-1">({cartItems.length})</span>
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <X className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="text-sm font-medium uppercase tracking-widest">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                      <img 
                        src={item.image || item.images?.[0]} // আপনার ডাটাবেসের ফিল্ড অনুযায়ী
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-sm font-bold text-black leading-tight line-clamp-2">
                            {item.name}
                          </h3>
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.shade && <p className="text-[11px] text-gray-500 font-medium">{item.shade}</p>}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200">
                          {/* Decrease Button */}
                          <button 
                            onClick={() => updateQuantity(item._id, 'decrease')}
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          
                          <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                          
                          {/* Increase Button */}
                          <button 
                            onClick={() => updateQuantity(item._id, 'increase')}
                            className="p-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-black">৳ {item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-black">৳ {cartTotal}</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-6 text-center">
                Taxes and shipping calculated at checkout
              </p>
              <button 
                disabled={cartItems.length === 0}
                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#CB006B] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}