import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Plus, UploadCloud, X } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  // মাল্টিপল ইমেজ ফাইল এবং প্রিভিউ রাখার স্টেট
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // ফর্মের স্টেট
  const [formData, setFormData] = useState({
    name: '',
    price: '',
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

  // ২. একাধিক ইমেজ ফাইল সিলেক্ট করলে প্রিভিউ তৈরি করা
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  // সিলেক্ট করা কোনো ছবি বাদ দেওয়ার ফাংশন
  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // ৩. Cloudinary-তে সবগুলো ছবি একসাথে আপলোড করার ফাংশন
  const uploadImagesToCloudinary = async (files) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary credentials missing in .env file!');
    }

    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );

      if (!res.ok) throw new Error('Image upload to Cloudinary failed');
      const cloudData = await res.json();
      return cloudData.secure_url;
    });

    return await Promise.all(uploadPromises);
  };

  // সিলেক্ট করা Main Category এর ওপর ভিত্তি করে Sub Categories বের করা
  const selectedMainCatObj = categories.find(c => c.name === formData.mainCategory);
  const subCategoriesList = selectedMainCatObj ? selectedMainCatObj.subCategories : [];

  // সিলেক্ট করা Sub Category এর ওপর ভিত্তি করে Sub-Child Categories বের করা
  const selectedSubCatObj = subCategoriesList.find(s => s.name === formData.subCategory);
  const subChildrenList = selectedSubCatObj ? selectedSubCatObj.subChildren : [];

  // ৪. প্রোডাক্ট সাবমিট করার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      setError('Please upload at least one product image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // প্রথমে Cloudinary-তে ছবিগুলো আপলোড করে URL নেওয়া
      setUploadStatus('Uploading images to Cloudinary...');
      const uploadedUrls = await uploadImagesToCloudinary(imageFiles);

      setUploadStatus('Saving product...');
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        image: uploadedUrls[0], // প্রথম ছবিটি মেইন থাম্বনেইল হিসেবে সেভ হবে
        images: uploadedUrls,   // সবগুলো ছবি গ্যালারি অ্যারে হিসেবে সেভ হবে
        category: {
          main: formData.mainCategory,
          sub: formData.subCategory,
          subChild: formData.subChildCategory || undefined
        },
        description: formData.description,
        badge: formData.badge || null
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      setUploadStatus('');
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
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Price (৳)</label>
              <input 
                type="number" 
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="1450"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
          </div>

          {/* Badge */}
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

          {/* Cloudinary Multiple Image Upload Section */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
              Product Images (First image will be the main thumbnail)
            </label>

            {/* Upload Dropzone */}
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 hover:border-[#CB006B] bg-gray-50/50 cursor-pointer transition-colors">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
                Click to select product images
              </span>
              <span className="text-[11px] text-gray-400 mt-1">
                Supports single or multiple images (JPG, PNG, WEBP)
              </span>
              <input 
                type="file" 
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Selected Images Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-[3/4] border border-gray-200 bg-gray-50 overflow-hidden group">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Main Image Indicator */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                        Main
                      </span>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/75 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  setFormData(prev => ({ ...prev, subCategory: '', subChildCategory: '' }));
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
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadStatus || 'Publishing...'}
              </>
            ) : (
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