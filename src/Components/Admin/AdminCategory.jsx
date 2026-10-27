import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit2, FolderPlus, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New Main Category Form State
  const [newMainName, setNewMainName] = useState('');

  // Editing State
  const [editingCategory, setEditingCategory] = useState(null); // holds category object being edited
  const [editMainName, setEditMainName] = useState('');
  const [editSubCategories, setEditSubCategories] = useState([]); // array of subcategories

  // Sub/SubChild adding inline state per main category
  const [activeSubInputMainId, setActiveSubInputMainId] = useState(null);
  const [newSubName, setNewSubName] = useState('');
  const [newSubChildInput, setNewSubChildInput] = useState('');

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

  // 1. Create New Main Category
  const handleCreateMainCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMainName, subCategories: [] })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create category');

      setSuccess('Main category created successfully!');
      setNewMainName('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Delete Entire Main Category
  const handleDeleteMainCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entire category and its sub-items?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. Open Edit Mode
  const startEditing = (cat) => {
    setEditingCategory(cat._id);
    setEditMainName(cat.name);
    // Deep copy subcategories so we can manipulate them safely
    setEditSubCategories(JSON.parse(JSON.stringify(cat.subCategories || [])));
  };

  // 4. Save Updated Main Category & Subcategories
  const handleSaveEdit = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editMainName, subCategories: editSubCategories })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');

      setSuccess('Category updated successfully!');
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  // 5. Add Subcategory or Sub-child to an existing category dynamically
  const handleAddSubOrChildToCategory = async (cat) => {
    if (!newSubName) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const subChildrenArray = newSubChildInput
        ? newSubChildInput.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      // Check if subcategory already exists
      let updatedSubs = [...cat.subCategories];
      const existingSubIndex = updatedSubs.findIndex(s => s.name.toLowerCase() === newSubName.toLowerCase());

      if (existingSubIndex >= 0) {
        // Append sub-children to existing subcategory
        updatedSubs[existingSubIndex].subChildren = [
          ...new Set([...updatedSubs[existingSubIndex].subChildren, ...subChildrenArray])
        ];
      } else {
        // Add new subcategory
        updatedSubs.push({
          name: newSubName,
          subChildren: subChildrenArray
        });
      }

      const res = await fetch(`${apiUrl}/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cat.name, subCategories: updatedSubs })
      });

      if (!res.ok) throw new Error('Failed to add sub-category');

      setSuccess('Sub-category added successfully!');
      setActiveSubInputMainId(null);
      setNewSubName('');
      setNewSubChildInput('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20">
      
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-widest text-black">Advanced Category Management</h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
          Create, edit, modify or delete main categories, sub-categories, and items freely
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-xs p-4 mb-6 font-medium border border-red-200">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 text-xs p-4 mb-6 font-medium border border-green-200">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Quick Create Main Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-[#CB006B]" /> Create Main Category
          </h2>

          <form onSubmit={handleCreateMainCategory} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Category Name</label>
              <input 
                type="text" 
                value={newMainName}
                onChange={(e) => setNewMainName(e.target.value)}
                required
                placeholder="e.g. Fragrance, Haircare"
                className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-black hover:bg-[#CB006B] text-white py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <Plus className="w-4 h-4" /> Add Main Category
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Existing Categories with Full Edit & Delete Controls */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6">Store Categories Structure</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#CB006B]" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-400 text-xs uppercase tracking-widest text-center py-10">No categories found</p>
          ) : (
            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat._id} className="border border-gray-200 p-5 rounded bg-white shadow-xs">
                  
                  {/* If Editing this Main Category */}
                  {editingCategory === cat._id ? (
                    <div className="space-y-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={editMainName}
                          onChange={(e) => setEditMainName(e.target.value)}
                          className="border border-gray-300 px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-[#CB006B] w-full"
                        />
                        <button 
                          onClick={() => handleSaveEdit(cat._id)} 
                          className="bg-green-600 text-white p-2 hover:bg-green-700" title="Save changes"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingCategory(null)} 
                          className="bg-gray-400 text-white p-2 hover:bg-gray-500" title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subcategories Editor inside Edit Mode */}
                      <div className="space-y-3 bg-gray-50 p-3 rounded">
                        <p className="text-[10px] font-bold uppercase text-gray-500">Edit Sub-Categories & Items:</p>
                        {editSubCategories.map((sub, sIdx) => (
                          <div key={sIdx} className="bg-white p-3 border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <input 
                                type="text"
                                value={sub.name}
                                onChange={(e) => {
                                  const updated = [...editSubCategories];
                                  updated[sIdx].name = e.target.value;
                                  setEditSubCategories(updated);
                                }}
                                className="border border-gray-300 px-2 py-1 text-xs font-bold uppercase"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const updated = editSubCategories.filter((_, idx) => idx !== sIdx);
                                  setEditSubCategories(updated);
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-bold uppercase"
                              >
                                Remove Sub
                              </button>
                            </div>

                            {/* Sub-children tags or comma separated */}
                            <div>
                              <input 
                                type="text"
                                placeholder="Sub-children items comma separated"
                                defaultValue={sub.subChildren.join(', ')}
                                onBlur={(e) => {
                                  const items = e.target.value.split(',').map(i => i.trim()).filter(Boolean);
                                  const updated = [...editSubCategories];
                                  updated[sIdx].subChildren = items;
                                  setEditSubCategories(updated);
                                }}
                                className="w-full border border-gray-200 px-2 py-1 text-xs text-gray-600"
                              />
                              <span className="text-[9px] text-gray-400">Click outside box to apply items</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Normal Display Header */
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <h3 className="text-base font-black text-[#CB006B] uppercase tracking-wider">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => startEditing(cat)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Main Category & Subcategories"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMainCategory(cat._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Main Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subcategories Display */}
                  <div className="space-y-4 mt-4 pl-4 border-l-2 border-gray-100">
                    {cat.subCategories?.map((sub, idx) => (
                      <div key={idx} className="bg-gray-50/60 p-3 rounded border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-black uppercase tracking-wide">
                            ↳ {sub.name}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {sub.subChildren?.length > 0 ? (
                            sub.subChildren.map((child, cIdx) => (
                              <span key={cIdx} className="bg-white border border-gray-200 text-gray-700 text-[10px] px-2.5 py-1 rounded font-medium shadow-2xs">
                                {child}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">No items inside</span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Quick Add Sub-Category / Sub-Child to this specific Category */}
                    {activeSubInputMainId === cat._id ? (
                      <div className="bg-pink-50/50 p-4 border border-pink-200 rounded space-y-3 mt-4">
                        <p className="text-[10px] font-bold uppercase text-[#CB006B]">Add Sub-Category / Sub-Child Items:</p>
                        <input 
                          type="text" 
                          placeholder="Sub-Category Name (e.g. Face, Lips)"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          className="w-full bg-white border border-gray-300 px-3 py-1.5 text-xs font-bold"
                        />
                        <input 
                          type="text" 
                          placeholder="Sub-Child Items separated by comma (e.g. Foundation, Powder)"
                          value={newSubChildInput}
                          onChange={(e) => setNewSubChildInput(e.target.value)}
                          className="w-full bg-white border border-gray-300 px-3 py-1.5 text-xs"
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddSubOrChildToCategory(cat)}
                            className="bg-[#CB006B] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded"
                          >
                            Save Sub-Category
                          </button>
                          <button 
                            onClick={() => setActiveSubInputMainId(null)}
                            className="bg-gray-300 text-black text-[10px] font-bold uppercase px-3 py-1.5 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setActiveSubInputMainId(cat._id);
                          setNewSubName('');
                          setNewSubChildInput('');
                        }}
                        className="text-[10px] font-bold uppercase text-[#CB006B] hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        + Add Sub-Category to {cat.name}
                      </button>
                    )}

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