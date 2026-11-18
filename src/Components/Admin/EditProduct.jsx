import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, UploadCloud, X } from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  // পুরনো ইমেজ URL এবং নতুন আপলোড করা ফাইল আলাদাভাবে ম্যানেজ করার স্টেট
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mainCategory: '',
    subCategory: '',
    subChildCategory: '',
    description: '',
    badge: ''
  });

  // ১. ক্যাটাগরি এবং নির্দিষ্ট প্রোডাক্টের ডেটা লোড করা
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const [catRes, prodRes] = await Promise.all([
          fetch(`${apiUrl}/categories`),
          fetch(`${apiUrl}/products/${id}`)
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (!prodRes.ok) throw new Error(prodData.message || 'Product not found');

        setCategories(catData);
        setFormData({
          name: prodData.name || '',
          price: prodData.price || '',
          mainCategory: prodData.category?.main || '',
          subCategory: prodData.category?.sub || '',
          subChildCategory: prodData.category?.subChild || '',
          description: prodData.description || '',
          badge: prodData.badge || ''
        });

        // পুরনো ছবিগুলো সেট করা (যদি images অ্যারে থাকে তবে সেটি, নাহলে শুধু image)
        if (prodData.images && prodData.images.length > 0) {
          setExistingImages(prodData.images);
        } else if (prodData.image) {
          setExistingImages([prodData.image]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // নতুন ছবি সিলেক্ট করলে
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setNewImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviewUrls((prev) => [...prev, ...previews]);
  };

  // পুরনো কোনো ছবি রিমুভ করলে
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // নতুন সিলেক্ট করা কোনো ছবি রিমুভ করলে
  const removeNewImage = (index) => {
    URL.revokeObjectURL(newPreviewUrls[index]);
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== index));
    setNewPreviewUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Cloudinary আপলোড ফাংশন
  const uploadImagesToCloudinary = async (files) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });

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

  // ২. আপডেট সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      setError('Product must have at least one image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let uploadedNewUrls = [];
      if (newImageFiles.length > 0) {
        setUploadStatus('Uploading new images...');
        uploadedNewUrls = await uploadImagesToCloudinary(newImageFiles);
      }

      const finalImagesList = [...existingImages, ...uploadedNewUrls];

      setUploadStatus('Updating product...');
      const updatedData = {
        name: formData.name,
        price: Number(formData.price),
        image: finalImagesList[0],
        images: finalImagesList,
        category: {
          main: formData.mainCategory,
          sub: formData.subCategory,
          subChild: formData.subChildCategory || undefined
        },
        description: formData.description,
        badge: formData.badge || null
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');

      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadStatus('');
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#CB006B]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-black">Edit Product</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Update product details & images
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Price (€)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#CB006B]"
              />
            </div>
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

          {/* Images Section */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
              Product Images
            </label>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#CB006B] bg-gray-50/50 cursor-pointer transition-colors">
              <UploadCloud className="w-7 h-7 text-gray-400 mb-1.5" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
                Add more images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImageChange}
                className="hidden"
              />
            </label>

            {/* Existing + New Previews Grid */}
            {(existingImages.length > 0 || newPreviewUrls.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {existingImages.map((url, index) => (
                  <div key={`old-${index}`} className="relative aspect-[3/4] border border-gray-200 bg-gray-50 overflow-hidden">
                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-black/75 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {newPreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative aspect-[3/4] border-2 border-[#CB006B] bg-gray-50 overflow-hidden">
                    <img src={url} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-[#CB006B] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-black/75 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Main Category</label>
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
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Sub Category</label>
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
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Sub-Child Category</label>
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

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 text-sm focus:outline-none focus:border-[#CB006B]"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-[#CB006B] text-white py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadStatus || 'Saving Changes...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}