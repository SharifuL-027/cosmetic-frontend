import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  ChevronDown,
  ShieldCheck,
  Truck,
  Sparkles,
  Loader2,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import { useCart } from '../../context/CartContext'; 

export default function ProductDetails() {
  const { id } = useParams();
  const cartContext = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ইন্টার‍্যাক্টিভ স্টেটসমূহ
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedShade, setSelectedShade] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // ১. প্রোডাক্ট এবং রিলেটেড প্রোডাক্ট ফেচ করা
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const [prodRes, allRes] = await Promise.all([
          fetch(`${apiUrl}/products/${id}`),
          fetch(`${apiUrl}/products`)
        ]);

        const prodData = await prodRes.json();
        if (!prodRes.ok) throw new Error(prodData.message || 'Product not found');

        setProduct(prodData);

        // গ্যালারির প্রথম ছবিটি ডিফল্ট হিসেবে সেট করা
        const gallery =
          prodData.images && prodData.images.length > 0
            ? prodData.images
            : [prodData.image];
        setSelectedImage(gallery[0]);

        // শেড থাকলে প্রথম শেড সিলেক্ট করা
        if (prodData.shades && prodData.shades.length > 0) {
          setSelectedShade(prodData.shades[0]);
        } else {
          setSelectedShade('');
        }

        setQuantity(1);

        // একই ক্যাটাগরির রিলেটেড প্রোডাক্ট ফিল্টার করা
        if (allRes.ok) {
          const allData = await allRes.json();
          const sameCategory = allData.filter(
            (item) =>
              item._id !== prodData._id &&
              item.category?.main === prodData.category?.main
          );
          const fallback = allData.filter((item) => item._id !== prodData._id);
          setRelatedProducts(
            (sameCategory.length >= 4 ? sameCategory : fallback).slice(0, 4)
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // ২. কার্টে প্রোডাক্ট যোগ করা ও স্লাইড-আউট CartDrawer ওপেন করা
  const handleAddToCart = () => {
    if (!product) return;

    const itemToAdd = {
      ...product,
      selectedShade: selectedShade || null,
      quantity
    };

    // আপনার CartContext অনুযায়ী ফাংশন কল হবে
    if (cartContext?.addToCart) {
      cartContext.addToCart(itemToAdd, quantity);
    } else if (cartContext?.addItem) {
      cartContext.addItem(itemToAdd);
    }

    // CartDrawer অটোমেটিক ওপেন করা
    if (cartContext?.setIsCartOpen) {
      cartContext.setIsCartOpen(true);
    } else if (cartContext?.openCart) {
      cartContext.openCart();
    }

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-9 h-9 animate-spin text-[#CB006B]" />
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 mt-4">
          Loading Luxury Experience...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-black uppercase tracking-widest text-black mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <Link
          to="/shop"
          className="bg-black hover:bg-[#CB006B] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  // সবগুলো গ্যালারি ইমেজ একত্রিত করা
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const accordions = [
    {
      id: 'description',
      title: 'Product Description',
      content:
        product.description ||
        'Crafted with ultra-refined pigments and skin-loving botanicals for effortless, long-lasting luxury wear.'
    },
    {
      id: 'how-to-use',
      title: 'Application & Ritual',
      content:
        'Apply evenly onto clean, prepped skin or lips using gentle strokes. Build layers gradually for your desired intensity and radiant finish.'
    },
    {
      id: 'shipping',
      title: 'Delivery & Authenticity',
      content:
        '100% authentic White Birch Beauty product. Inside Dhaka delivery within 24–48 hours; nationwide delivery within 3–5 business days. Cash on Delivery available.'
    }
  ];

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24">
      {/* ১. মিনিমালিস্ট এডিটোরিয়াল ব্রেডক্রাম্ব */}
      <div className="border-b border-gray-100 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-[#CB006B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[#CB006B] transition-colors">
            {product.category?.main || 'Shop'}
          </Link>
          {product.category?.sub && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-500">{product.category.sub}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-black truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      {/* ২. মেইন প্রোডাক্ট শোকেস সেকশন */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* বাম পাশ: মাল্টিপল ইমেজ গ্যালারি (৭ কলাম) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* থাম্বনেইল লিস্ট (একাধিক ছবি থাকলে দেখাবে) */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[640px] pb-2 sm:pb-0 shrink-0">
                {galleryImages.map((imgUrl, index) => {
                  const isSelected = selectedImage === imgUrl;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-24 sm:w-20 sm:h-28 overflow-hidden border-2 transition-all shrink-0 bg-gray-50 ${
                        isSelected
                          ? 'border-[#CB006B] opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* মেইন হাই-রেজোলিউশন ইমেজ ক্যানভাস */}
            <div className="relative flex-1 aspect-[4/5] bg-[#F7F7F7] overflow-hidden group border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </AnimatePresence>

              {/* লাক্সারি ব্যাজ */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-1.5">
                  {product.badge}
                </span>
              )}

              {/* ফুলস্ক্রিন জুম বাটন */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-black hover:text-white text-black p-2.5 shadow-sm backdrop-blur-sm transition-colors"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ডান পাশ: স্টিকি প্রোডাক্ট ডিটেইলস ও অ্যাকশন প্যানেল (৫ কলাম) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* ক্যাটাগরি ও রেটিং */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CB006B]">
                {product.category?.sub || product.category?.main || 'Luxury Cosmetics'}
              </span>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-black">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(product.rating || 5)
                          ? 'fill-black text-black'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-gray-500 tracking-wider">
                  ({product.reviews || 24} Reviews)
                </span>
              </div>
            </div>

            {/* প্রোডাক্টের নাম ও প্রাইস */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black leading-tight">
                {product.name}
              </h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-black text-black tracking-wide">
                  ৳{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-0.5 border border-green-200">
                  In Stock
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* শেড সিলেক্টর (যদি প্রোডাক্টে শেড থাকে) */}
            {product.shades && product.shades.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700">
                    Select Shade: <strong className="text-black">{selectedShade}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.shades.map((shade, idx) => {
                    const isHex = shade.startsWith('#');
                    const isActive = selectedShade === shade;
                    return isHex ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedShade(shade)}
                        style={{ backgroundColor: shade }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          isActive
                            ? 'ring-2 ring-offset-2 ring-[#CB006B] scale-110 border-white'
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        title={shade}
                      />
                    ) : (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedShade(shade)}
                        className={`px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                          isActive
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-gray-700 hover:border-black'
                        }`}
                      >
                        {shade}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* কোয়ান্টিটি এবং Add to Bag বাটন */}
            <div className="space-y-3 pt-1">
              <div className="flex items-stretch gap-3">
                {/* Quantity Counter */}
                <div className="flex items-center border border-gray-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-3.5 text-gray-600 hover:text-black transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-black">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-3.5 text-gray-600 hover:text-black transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-black hover:bg-[#CB006B] text-white py-4 px-6 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-colors duration-300 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedFeedback
                    ? 'Added to Bag ✓'
                    : `Add to Bag — ৳${(product.price * quantity).toLocaleString('en-IN')}`}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`px-4 border transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-[#CB006B] bg-[#CB006B]/5 text-[#CB006B]'
                      : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? 'fill-[#CB006B]' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* লাক্সারি ট্রাস্ট ব্যাজসমূহ */}
            <div className="grid grid-cols-3 gap-2 py-4 px-3 bg-[#FAFAFA] border border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#CB006B]" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-700">
                  100% Authentic
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 border-x border-gray-200">
                <Sparkles className="w-4 h-4 text-[#CB006B]" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-700">
                  Cruelty Free
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#CB006B]" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-700">
                  Express Delivery
                </span>
              </div>
            </div>

            {/* মিনিমালিস্ট অ্যাকর্ডিয়ন ডিটেইলস */}
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {accordions.map((acc) => {
                const isOpen = activeAccordion === acc.id;
                return (
                  <div key={acc.id} className="py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveAccordion(isOpen ? '' : acc.id)
                      }
                      className="w-full flex items-center justify-between text-left"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                        {acc.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#CB006B]' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            {acc.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ৩. কিউরেটেড রিলেটেড প্রোডাক্টস (You May Also Like) */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#CB006B] mb-1.5">
                Curated For You
              </p>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-black">
                You May Also Like
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-[#CB006B] underline underline-offset-4 transition-colors"
            >
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="group block"
              >
                <div className="relative aspect-3/4 bg-[#F7F7F7] overflow-hidden mb-3.5 border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {item.category?.sub || item.category?.main}
                </p>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black group-hover:text-[#CB006B] transition-colors mt-1 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs font-black text-black mt-1">
                  ৳{Number(item.price).toLocaleString('en-IN')}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ৪. ফুলস্ক্রিন ইমেজ লাইটবক্স মোডাল */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-[#CB006B] p-2 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={selectedImage}
              alt={product.name}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-[92vw] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}