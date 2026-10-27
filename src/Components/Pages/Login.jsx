import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isLogin 
            ? { email: formData.email, password: formData.password }
            : formData
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('wbb_user', JSON.stringify(data));
      
      if (data.role === 'admin') {
        navigate('/admin/dashboard'); 
      } else {
        navigate('/'); 
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 'h-screen' এবং 'overflow-hidden' ব্যবহার করা হয়েছে যাতে কোনো স্ক্রলবার না আসে
    <div className="h-screen w-full flex bg-[#F9F9F9] overflow-hidden relative">
      
      {/* Back Button (Mobile) - শুধু মোবাইলে দেখাবে */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 lg:hidden flex items-center gap-2 text-black hover:text-[#CB006B] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Website</span>
      </Link>

      {/* Left Side - Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-black h-full">
        
        {/* Back Button (Desktop) - ইমেজের উপরে থাকবে */}
        <Link 
          to="/" 
          className="absolute top-10 left-10 z-10 flex items-center gap-2 text-white/80 hover:text-white hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Return to Website</span>
        </Link>

        <img 
          src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000" 
          alt="Luxury Beauty" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-16">
          <h2 className="text-white text-5xl font-black italic tracking-tighter uppercase font-['Arial_Black',sans-serif] mb-4">
            Unleash Your <br/> Inner Beauty
          </h2>
          <p className="text-white/80 text-sm tracking-widest uppercase font-bold">
            Join the exclusive WBB community today.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      {/* 'overflow-y-auto' দেওয়া হয়েছে যেন ছোট স্ক্রিনে শুধু ফর্মের অংশটুকু স্ক্রল হয়, পুরো পেজ নয় */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 h-full overflow-y-auto">
        <div className="w-full max-w-md my-auto pt-10 lg:pt-0">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter text-black uppercase font-['Arial_Black',sans-serif]">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-3">
              {isLogin ? 'Sign in to access your account' : 'Become a WBB member'}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-600 border border-red-200 text-sm p-4 text-center font-medium mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field (Only for Register) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] transition-colors bg-white"
                    placeholder="Enter your full name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] transition-colors bg-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] transition-colors bg-white"
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#CB006B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end pt-1">
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-[#CB006B] transition-colors uppercase tracking-widest">
                  Forgot Password?
                </a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-[#CB006B] text-white py-3.5 mt-2 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="mt-2 text-xs font-black text-black hover:text-[#CB006B] uppercase tracking-widest transition-colors"
            >
              {isLogin ? 'Register Here' : 'Sign In Here'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}