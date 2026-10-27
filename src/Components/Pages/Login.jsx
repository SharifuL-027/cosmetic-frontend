import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

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

  // যদি ইউজার আগে থেকেই লগইন করা থাকে, তবে তাকে ড্যাশবোর্ড বা হোমে পাঠিয়ে দেবে
  useEffect(() => {
    const userInfo = localStorage.getItem('wbb_user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

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
    <div className="min-h-screen w-full flex bg-[#F9F9F9]">
      
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000" 
          alt="Luxury Beauty" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-16">
          <h2 className="text-white text-5xl font-black italic tracking-tighter uppercase font-['Arial_Black',sans-serif] mb-4">
            Unleash Your <br/> Inner Beauty
          </h2>
          <p className="text-white/80 text-sm tracking-widest uppercase font-bold">
            Join the exclusive WBB community today.
          </p>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black italic tracking-tighter text-black uppercase font-['Arial_Black',sans-serif]">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-3">
              {isLogin ? 'Sign in to access your account' : 'Become a WBB member'}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                key="error-box" // ক্র্যাশ ঠেকানোর জন্য key যুক্ত করা হলো
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-600 border border-red-200 text-sm p-4 text-center font-medium mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  key="name-field" // ক্র্যাশ ঠেকানোর জন্য key যুক্ত করা হলো
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full border border-gray-300 px-4 py-3.5 text-sm focus:outline-none focus:border-[#CB006B] transition-colors"
                    placeholder="Enter your full name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-3.5 text-sm focus:outline-none focus:border-[#CB006B] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3.5 text-sm focus:outline-none focus:border-[#CB006B] transition-colors"
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
              <div className="flex justify-end">
                <a href="#" className="text-[11px] font-bold text-gray-500 hover:text-[#CB006B] transition-colors uppercase tracking-widest">
                  Forgot Password?
                </a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-[#CB006B] text-white py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-200 pt-6">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="mt-2 text-sm font-black text-black hover:text-[#CB006B] uppercase tracking-widest transition-colors"
            >
              {isLogin ? 'Register Here' : 'Sign In Here'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}