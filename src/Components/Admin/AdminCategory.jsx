import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, FolderPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [mainName, setMainName] = useState('');
  const [subName, setSubName] = useState('');
  const [subChildInput, setSubChildInput] = useState('');

  // Data fetch kora
  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/categories`);
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Notun Main Category ba Sub-category add korar handler
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Sub-children gulo ke comma separated string theke array banano
      const subChildrenArray = subChildInput
        ? subChildInput.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      const payload = {
        name: mainName,
        subCategories: [
          {
            name: subName,
            subChildren: subChildrenArray
          }
        ]
      };

      const res = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add category');

      setSuccess('Category added successfully!');
      setMainName('');
      setSubName('');
      setSubChildInput('');
      fetchCategories(); // list refresh kora
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-widest text-black">Category Management</h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
          Add and manage nested categories for your store
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Add Category Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[#CB006B]" /> Add New Category
          </h2>

          {error && <div className="bg-red-50 text-red-600 text-xs p-3 mb-4 font-medium">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 text-xs p-3 mb-4 font-medium">{success}</div>}

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Main Category Name</label>
              <input 
                type="text" 
                value={mainName}
                onChange={(e) => setMainName(e.target.value)}
                required
                placeholder="e.g. Makeup or Skincare"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Sub Category Name</label>
              <input 
                type="text" 
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                required
                placeholder="e.g. Face or Eyes"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Sub-Child Items (Comma Separated)</label>
              <input 
                type="text" 
                value={subChildInput}
                onChange={(e) => setSubChildInput(e.target.value)}
                placeholder="e.g. Foundation, Concealer, Primer"
                className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#CB006B]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Separate multiple items with commas</span>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-black hover:bg-[#CB006B] text-white py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 mt-4"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <Plus className="w-4 h-4" /> Save Category
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Existing Categories List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6">Existing Categories Structure</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#CB006B]" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-400 text-xs uppercase tracking-widest text-center py-10">No categories found</p>
          ) : (
            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat._id} className="border border-gray-100 p-4 rounded bg-gray-50/50">
                  <h3 className="text-sm font-black text-[#CB006B] uppercase tracking-wider mb-3">
                    {cat.name}
                  </h3>
                  <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                    {cat.subCategories?.map((sub, idx) => (
                      <div key={idx}>
                        <span className="text-xs font-bold text-black uppercase tracking-wide">
                          ↳ {sub.name}
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5 pl-4">
                          {sub.subChildren?.length > 0 ? (
                            sub.subChildren.map((child, cIdx) => (
                              <span key={cIdx} className="bg-white border border-gray-200 text-gray-700 text-[10px] px-2.5 py-0.5 rounded font-medium">
                                {child}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">No sub-children</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}