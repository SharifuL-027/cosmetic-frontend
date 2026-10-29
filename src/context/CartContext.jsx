import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // লোকাল স্টোরেজ থেকে কার্ট ডেটা লোড করা
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('wbb_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // কার্টে কোনো পরিবর্তন হলে তা লোকাল স্টোরেজে সেভ করা
  useEffect(() => {
    localStorage.setItem('wbb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ১. কার্টে নতুন আইটেম যোগ করা
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        // আইটেম আগে থেকেই থাকলে শুধু quantity বাড়াবে
        return prevItems.map(item =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      // নতুন আইটেম হলে quantity 1 দিয়ে যোগ করবে
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // ২. কার্ট থেকে আইটেম রিমুভ করা
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  // ৩. Quantity কমানো বা বাড়ানো
  const updateQuantity = (productId, type) => {
    setCartItems((prevItems) => 
      prevItems.map(item => {
        if (item._id === productId) {
          if (type === 'increase') return { ...item, quantity: item.quantity + 1 };
          if (type === 'decrease' && item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  // ৪. টোটাল প্রাইস হিসাব করা
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};