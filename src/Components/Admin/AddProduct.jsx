import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ফর্মের স্টেট
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    mainCategory: '',
    subCategory: '',
    subChildCategory: '',
    description: '',
    badge: ''
  });

  // ১. ডাটাবেস থেকে ডাইনামিক ক্যাটাগরিগুলো ফেচ করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // সিলেক্ট করা Main Category এর ওপর ভিত্তি করে Sub Categories বের করা
  const selectedMainCatObj = categories.find(c => c.name === formData.mainCategory);
  const subCategoriesList = selectedMainCatObj ? selectedMainCatObj.subCategories : [];

  // সিলেক্ট করা Sub Category এর ওপর ভিত্তি করে Sub-Child Categories বের করা
  const selectedSubCatObj = subCategoriesList.find(s => s.name === formData.subCategory);
  const subChildrenList = selectedSubCatObj ? selectedSubCatObj.subChildren : [];

  // ২. প্রোডাক্ট সাবমিট করার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      image: formData.image,
      category: {
        main: formData.mainCategory,
        sub: formData.subCategory,
        subChild: formData.subChildCategory || undefined
      },
      description: formData.description,
      badge: formData.badge || null
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // টোকেন পাস করতে চাইলে এখানে করতে পারেন
        },
        body: JSON.stringify(productData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      // সাকসেসফুল হলে প্রোডাক্টস পেজে রিডাইরেক্ট করবে
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-black">Add New Product</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Create a new item in your inventory
          </p>
        </div>
        <Link 
          to="/admin/products" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-[#CB006B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      {/* Form Container */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-4 mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Product Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Product Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Lumina Glow Foundation"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Price (£)</label>
              <input 
                type="number" 
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="14.95"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
          </div>

          {/* Image URL & Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Image URL</label>
              <input 
                type="url" 
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Badge (Optional)</label>
              <input 
                type="text" 
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. BESTSELLER, NEW"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
          </div>

          {/* Dynamic Nested Category Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            
            {/* 1. Main Category */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Main Category</label>
              <select 
                name="mainCategory"
                value={formData.mainCategory}
                onChange={(e) => {
                  handleChange(e);
                  setFormData(prev => ({ ...prev, subCategory: '', subChildCategory: '' })); // reset sub on change
                }}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] bg-white"
              >
                <option value="">Select Main</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* 2. Sub Category */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Sub Category</label>
              <select 
                name="subCategory"
                value={formData.subCategory}
                onChange={(e) => {
                  handleChange(e);
                  setFormData(prev => ({ ...prev, subChildCategory: '' }));
                }}
                required
                disabled={!formData.mainCategory}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] bg-white disabled:bg-gray-100"
              >
                <option value="">Select Sub</option>
                {subCategoriesList.map(sub => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* 3. Sub-Child Category */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Sub-Child Category</label>
              <select 
                name="subChildCategory"
                value={formData.subChildCategory}
                onChange={handleChange}
                disabled={!formData.subCategory}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] bg-white disabled:bg-gray-100"
              >
                <option value="">Select Item (Optional)</option>
                {subChildrenList.map(child => (
                  <option key={child} value={child}>{child}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product details..."
              className="w-full border border-gray-300 p-4 text-sm focus:outline-none focus:border-[#CB006B]"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-[#CB006B] text-white py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Plus className="w-4 h-4" /> Publish Product
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}