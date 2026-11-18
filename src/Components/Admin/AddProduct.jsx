import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Plus, UploadCloud, X, Sparkles, Check } from 'lucide-react';

const PRESET_HIGHLIGHTS = [
  '100% AUTHENTIC',
  'CRUELTY FREE',
  'VEGAN',
  'PARABEN FREE',
  'FOR ALL SKIN TYPES',
  'DERMATOLOGIST TESTED'
];

// কসমেটিক আইটেমের স্ট্যান্ডার্ড শেড লাইব্রেরি
const COSMETIC_SHADE_PRESETS = {
  'Lipstick & Lip': [
    { name: 'Rose Nude', color: '#C87D7B' },
    { name: 'Velvet Mauve', color: '#9E5B67' },
    { name: 'Ruby Woo', color: '#B81D24' },
    { name: 'Classic Crimson', color: '#990012' },
    { name: 'Coral Sunset', color: '#E86850' },
    { name: 'Soft Peach', color: '#E89B82' },
    { name: 'Berry Crush', color: '#7D1E42' },
    { name: 'Deep Plum', color: '#58183A' },
    { name: 'Spiced Terracotta', color: '#A64B38' },
    { name: 'Caramel Kiss', color: '#9C5E44' },
    { name: 'Dusty Pink', color: '#D48A94' },
    { name: 'Chocolate Truffle', color: '#5A3229' }
  ],
  'Foundation & Concealer': [
    { name: 'Porcelain', color: '#F7E7D8' },
    { name: 'Fair Ivory', color: '#F3D8C1' },
    { name: 'Warm Vanilla', color: '#ECC7A8' },
    { name: 'Natural Beige', color: '#DFB18B' },
    { name: 'Sand', color: '#D49E73' },
    { name: 'Golden Honey', color: '#C18557' },
    { name: 'Warm Caramel', color: '#A86B3E' },
    { name: 'Rich Chestnut', color: '#844E2B' },
    { name: 'Deep Mocha', color: '#61361D' },
    { name: 'Espresso', color: '#422312' }
  ],
  'Blush & Bronzer': [
    { name: 'Orgasmic Peach', color: '#F08C7D' },
    { name: 'Petal Pink', color: '#F4A6B8' },
    { name: 'Rosy Glow', color: '#DF6E86' },
    { name: 'Sunlit Coral', color: '#E56B55' },
    { name: 'Apricot Glow', color: '#E68A66' },
    { name: 'Warm Bronze', color: '#9E6240' },
    { name: 'Sunkissed Tan', color: '#874F31' },
    { name: 'Sculpt Contour', color: '#6E4735' }
  ],
  'Eye & Shimmer': [
    { name: 'Champagne Gold', color: '#E8CFA6' },
    { name: 'Rose Gold', color: '#D89A8C' },
    { name: 'Copper Spark', color: '#B5633B' },
    { name: 'Smoky Charcoal', color: '#3A3B3C' },
    { name: 'Jet Black', color: '#111111' },
    { name: 'Midnight Navy', color: '#1B2A4A' },
    { name: 'Emerald Glam', color: '#1F5E4B' },
    { name: 'Bronze Shimmer', color: '#8C583A' }
  ]
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  // মাল্টিপল ইমেজ স্টেট
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Shades স্টেট
  const [shades, setShades] = useState([]);
  const [activeShadeTab, setActiveShadeTab] = useState('Lipstick & Lip');
  const [shadeName, setShadeName] = useState('');
  const [shadeColor, setShadeColor] = useState('#CB006B');
  const [useColorSwatch, setUseColorSwatch] = useState(true);

  // Highlights স্টেট
  const [highlights, setHighlights] = useState(['100% AUTHENTIC', 'CRUELTY FREE']);
  const [customHighlight, setCustomHighlight] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mainCategory: '',
    subCategory: '',
    subChildCategory: '',
    whyWeLoveIt: '',
    description: '',
    ingredients: '',
    howToUse: '',
    badge: ''
  });

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

  // ইমেজ হ্যান্ডলার
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // প্রিসেট প্যালেট থেকে শেড টগল (এক ক্লিকে Add / Remove)
  const togglePresetShade = (presetShade) => {
    const exists = shades.some(
      (s) => s.name.toLowerCase() === presetShade.name.toLowerCase()
    );
    if (exists) {
      setShades((prev) =>
        prev.filter((s) => s.name.toLowerCase() !== presetShade.name.toLowerCase())
      );
    } else {
      setShades((prev) => [...prev, presetShade]);
    }
  };

  // কাস্টম Shade যোগ করা
  const handleAddCustomShade = () => {
    const trimmedName = shadeName.trim();
    if (!trimmedName) return;

    if (shades.some((s) => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      return;
    }

    const newShade = {
      name: trimmedName,
      color: useColorSwatch ? shadeColor : null
    };

    setShades((prev) => [...prev, newShade]);
    setShadeName('');
  };

  const removeShade = (indexToRemove) => {
    setShades((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Highlight টগল/যোগ
  const toggleHighlight = (tag) => {
    setHighlights((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomHighlight = () => {
    const formatted = customHighlight.trim().toUpperCase();
    if (!formatted || highlights.includes(formatted)) return;
    setHighlights((prev) => [...prev, formatted]);
    setCustomHighlight('');
  };

  // Cloudinary আপলোড
  const uploadImagesToCloudinary = async (files) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: data }
      );
      if (!res.ok) throw new Error('Image upload to Cloudinary failed');
      const cloudData = await res.json();
      return cloudData.secure_url;
    });

    return await Promise.all(uploadPromises);
  };

  const selectedMainCatObj = categories.find((c) => c.name === formData.mainCategory);
  const subCategoriesList = selectedMainCatObj ? selectedMainCatObj.subCategories : [];
  const selectedSubCatObj = subCategoriesList.find((s) => s.name === formData.subCategory);
  const subChildrenList = selectedSubCatObj ? selectedSubCatObj.subChildren : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setError('Please upload at least one product image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setUploadStatus('Uploading images to Cloudinary...');
      const uploadedUrls = await uploadImagesToCloudinary(imageFiles);

      setUploadStatus('Saving product...');
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        image: uploadedUrls[0],
        images: uploadedUrls,
        category: {
          main: formData.mainCategory,
          sub: formData.subCategory,
          subChild: formData.subChildCategory || undefined
        },
        whyWeLoveIt: formData.whyWeLoveIt,
        description: formData.description,
        ingredients: formData.ingredients,
        howToUse: formData.howToUse,
        highlights,
        shades,
        badge: formData.badge || null
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-black">Add New Product</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Create a complete luxury product listing
          </p>
        </div>
        <Link
          to="/admin/products"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-[#CB006B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-4 mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* ১. নাম, প্রাইস (€) ও ব্যাজ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Velvet Silk Lipstick"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Price (€) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="24.50"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Badge (Optional)
              </label>
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

          {/* ২. মাল্টিপল ইমেজ আপলোড */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
              Product Gallery Images * (First image is Main)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#CB006B] bg-gray-50/50 cursor-pointer transition-colors">
              <UploadCloud className="w-7 h-7 text-gray-400 mb-1.5" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
                Click to select single or multiple images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square border border-gray-200 bg-gray-50 overflow-hidden">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 bg-black/75 hover:bg-red-600 text-white p-1 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ৩. ক্যাটাগরি ড্রপডাউন */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Main Category *
              </label>
              <select
                name="mainCategory"
                value={formData.mainCategory}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev) => ({ ...prev, subCategory: '', subChildCategory: '' }));
                }}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] bg-white"
              >
                <option value="">Select Main</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Sub Category *
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev) => ({ ...prev, subChildCategory: '' }));
                }}
                required
                disabled={!formData.mainCategory}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] bg-white disabled:bg-gray-100"
              >
                <option value="">Select Sub</option>
                {subCategoriesList.map((sub) => (
                  <option key={sub.name} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Sub-Child Category
              </label>
              <select
                name="subChildCategory"
                value={formData.subChildCategory}
                onChange={handleChange}
                disabled={!formData.subCategory}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B] bg-white disabled:bg-gray-100"
              >
                <option value="">Select Item (Optional)</option>
                {subChildrenList.map((child) => (
                  <option key={child} value={child}>{child}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ৪. কসমেটিক শেড লাইব্রেরি + কাস্টম কালার পিকার */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest">
                Select Cosmetic Shades (One-Click Add)
              </label>
              {shades.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShades([])}
                  className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline"
                >
                  Clear All ({shades.length})
                </button>
              )}
            </div>

            {/* প্রিসেট কসমেটিক শেড ক্যাটাগরি ট্যাব ও কালার বক্স */}
            <div className="border border-gray-200 bg-[#FAFAFA] p-4 rounded">
              {/* ট্যাব বাটন */}
              <div className="flex flex-wrap gap-1.5 border-b border-gray-200 pb-3 mb-3.5">
                {Object.keys(COSMETIC_SHADE_PRESETS).map((categoryTab) => (
                  <button
                    key={categoryTab}
                    type="button"
                    onClick={() => setActiveShadeTab(categoryTab)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      activeShadeTab === categoryTab
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-black'
                    }`}
                  >
                    {categoryTab}
                  </button>
                ))}
              </div>

              {/* সিলেক্টেড ট্যাবের সব শেড সোয়াচ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {COSMETIC_SHADE_PRESETS[activeShadeTab].map((preset) => {
                  const isSelected = shades.some(
                    (s) => s.name.toLowerCase() === preset.name.toLowerCase()
                  );
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => togglePresetShade(preset)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 text-left border transition-all ${
                        isSelected
                          ? 'border-[#CB006B] bg-[#CB006B]/5 ring-1 ring-[#CB006B]'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300 shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: preset.color }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </span>
                      <span className="text-[11px] font-bold text-gray-800 truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* কাস্টম কালার পিকার ও শেডের নাম যোগ করার অপশন */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Or Add Custom Shade / Size
                </span>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useColorSwatch}
                    onChange={(e) => setUseColorSwatch(e.target.checked)}
                    className="accent-[#CB006B]"
                  />
                  Include Color Swatch
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {useColorSwatch && (
                  <div className="flex items-center gap-2 border border-gray-300 px-2.5 py-1.5 bg-gray-50">
                    <input
                      type="color"
                      value={shadeColor}
                      onChange={(e) => setShadeColor(e.target.value)}
                      className="w-7 h-7 border-0 cursor-pointer bg-transparent"
                      title="Pick Custom Color"
                    />
                    <span className="text-[11px] font-medium text-gray-600">Pick</span>
                  </div>
                )}

                <input
                  type="text"
                  value={shadeName}
                  onChange={(e) => setShadeName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomShade())}
                  placeholder={useColorSwatch ? "Custom shade name (e.g. Crimson Dusk)..." : "Size/Variant (e.g. 50ml, 100ml)..."}
                  className="flex-1 min-w-[220px] border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#CB006B]"
                />

                <button
                  type="button"
                  onClick={handleAddCustomShade}
                  className="bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#CB006B] transition-colors"
                >
                  + Add Custom
                </button>
              </div>
            </div>

            {/* বর্তমানে সিলেক্ট করা সব শেডের প্রিভিউ */}
            {shades.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Selected Shades for This Product ({shades.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {shades.map((shadeObj, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-bold"
                    >
                      {shadeObj.color && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/60 shrink-0"
                          style={{ backgroundColor: shadeObj.color }}
                        />
                      )}
                      {shadeObj.name}
                      <button
                        type="button"
                        onClick={() => removeShade(idx)}
                        className="text-gray-300 hover:text-red-400 ml-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ৫. হাইলাইট ট্যাগস */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
              Product Highlights / Quality Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_HIGHLIGHTS.map((tag) => {
                const active = highlights.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleHighlight(tag)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                      active
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-black'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customHighlight}
                onChange={(e) => setCustomHighlight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHighlight())}
                placeholder="Add custom tag (e.g. FRAGRANCE FREE)"
                className="flex-1 border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#CB006B]"
              />
              <button
                type="button"
                onClick={addCustomHighlight}
                className="bg-gray-800 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-[#CB006B]"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* ৬. ডিটেইলস পেজের ৪টি অ্যাকর্ডিয়ন ফিল্ড */}
          <div className="space-y-5 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#CB006B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Product Details Accordions
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Why We Love It
              </label>
              <textarea
                name="whyWeLoveIt"
                rows="2"
                value={formData.whyWeLoveIt}
                onChange={handleChange}
                placeholder="Highlight what makes this product special..."
                className="w-full border border-gray-300 p-3.5 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Full product description..."
                className="w-full border border-gray-300 p-3.5 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                  Ingredients
                </label>
                <textarea
                  name="ingredients"
                  rows="3"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="Aqua, Glycerin, Vitamin E..."
                  className="w-full border border-gray-300 p-3.5 text-sm focus:outline-none focus:border-[#CB006B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                  How To Use
                </label>
                <textarea
                  name="howToUse"
                  rows="3"
                  value={formData.howToUse}
                  onChange={handleChange}
                  placeholder="Step-by-step application instructions..."
                  className="w-full border border-gray-300 p-3.5 text-sm focus:outline-none focus:border-[#CB006B]"
                />
              </div>
            </div>
          </div>

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