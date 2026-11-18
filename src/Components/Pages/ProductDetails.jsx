import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Sparkles,
  Loader2,
  X,
  Award
} from 'lucide-react';
import { useCart } from '../../context/CartContext'; // আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী দিন (যেমন: ../context/CartContext বা ../../context/CartContext)

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart() || {};

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // গ্যালারি এবং প্রোডাক্ট সিলেকশন স্টেট
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // অ্যাকর্ডিয়ন স্টেট
  const [openAccordion, setOpenAccordion] = useState('description');

  // Frequently Bought Together বান্ডেল স্টেট
  const [bundleChecked, setBundleChecked] = useState({ main: true, companion: true });
  const [bundleAdded, setBundleAdded] = useState(false);

  // রিভিউ ও প্রশ্নোত্তর স্টেট
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Nusrat Jahan',
      rating: 5,
      date: '2 days ago',
      comment: 'Packaging and quality both feel super luxurious! Totally worth every euro.'
    }
  ]);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [questionsList, setQuestionsList] = useState([
    {
      id: 1,
      q: 'Is this suitable for sensitive skin?',
      a: 'Yes, it is dermatologist-tested, cruelty-free, and gentle on all skin types.'
    }
  ]);

  // ১. প্রোডাক্ট ও রিলেটেড প্রোডাক্ট লোড করা
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
        setActiveImgIndex(0);
        setQuantity(1);
        setBundleChecked({ main: true, companion: true });

        // ডিফল্ট শেড সেট করা (অবজেক্ট বা স্ট্রিং দুইটাই সাপোর্ট করবে)
        if (prodData.shades && prodData.shades.length > 0) {
          const firstShade = prodData.shades[0];
          setSelectedShade(
            typeof firstShade === 'object' && firstShade !== null
              ? firstShade.name
              : firstShade
          );
        } else {
          setSelectedShade('');
        }

        if (allRes.ok) {
          const allData = await allRes.json();
          const others = allData.filter((item) => item._id !== prodData._id);
          const sameCat = others.filter(
            (item) => item.category?.main === prodData.category?.main
          );
          setRelatedProducts((sameCat.length >= 4 ? sameCat : others).slice(0, 4));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#CB006B]" />
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 mt-3">
          Loading Product...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-black uppercase tracking-widest text-black mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <Link
          to="/shop"
          className="bg-black hover:bg-[#CB006B] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // গ্যালারি ইমেজ অ্যারে
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handlePrevImage = () => {
    setActiveImgIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImgIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  // সিঙ্গেল প্রোডাক্ট কার্টে যোগ করা
  const handleAddToBag = () => {
    if (!addToCart) return;
    addToCart(
      {
        ...product,
        selectedShade: selectedShade || null
      },
      quantity
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  // Frequently Bought Together বান্ডেল হিসাব ও কার্টে যোগ
  const companionProduct = relatedProducts[0] || null;
  const bundleTotal =
    (bundleChecked.main ? Number(product.price) : 0) +
    (companionProduct && bundleChecked.companion
      ? Number(companionProduct.price)
      : 0);

  const handleAddBundleToBag = () => {
    if (!addToCart) return;
    if (bundleChecked.main) {
      addToCart({ ...product, selectedShade: selectedShade || null }, 1);
    }
    if (companionProduct && bundleChecked.companion) {
      addToCart(companionProduct, 1);
    }
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1800);
  };

  // নতুন রিভিউ সাবমিট
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedRating || !reviewText.trim()) return;
    setReviewsList((prev) => [
      {
        id: Date.now(),
        name: reviewerName.trim() || 'Verified Buyer',
        rating: selectedRating,
        date: 'Just now',
        comment: reviewText.trim()
      },
      ...prev
    ]);
    setSelectedRating(0);
    setReviewText('');
    setReviewerName('');
  };

  // নতুন প্রশ্ন সাবমিট
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    setQuestionsList((prev) => [
      {
        id: Date.now(),
        q: questionInput.trim(),
        a: 'Thank you for asking! Our beauty specialist will reply shortly.'
      },
      ...prev
    ]);
    setQuestionInput('');
    setShowQuestionForm(false);
  };

  const accordions = [
    {
      id: 'why',
      title: 'Why We Love It',
      content:
        product.whyWeLoveIt ||
        'Curated by White Birch Beauty for its high-performance formula, velvety finish, and effortless luxury experience that elevates your daily beauty ritual.'
    },
    {
      id: 'description',
      title: 'Description',
      content:
        product.description ||
        'Crafted with refined pigments and nourishing botanicals for smooth, long-lasting wear.'
    },
    {
      id: 'ingredients',
      title: 'Ingredients',
      content:
        product.ingredients ||
        'Aqua (Water), Glycerin, Botanical Extracts, Vitamin E (Tocopherol), Natural Mineral Pigments. Paraben-free, sulfate-free, and 100% cruelty-free.'
    },
    {
      id: 'how-to-use',
      title: 'How To Use',
      content:
        product.howToUse ||
        'Apply gently onto clean, prepped skin or lips using fingertips or a precision brush. Layer gradually to build your desired intensity.'
    }
  ];

  const highlightTags =
    product.highlights && product.highlights.length > 0
      ? product.highlights
      : ['100% AUTHENTIC', 'CRUELTY FREE', 'FOR ALL SKIN TYPES', 'DERMATOLOGIST TESTED'];

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24">
      
      {/* মিনিমাল ব্রেডক্রাম্ব */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <nav className="flex items-center flex-wrap gap-1.5 text-[11px] text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">
            {product.category?.main || 'Shop'}
          </Link>
          {product.category?.sub && (
            <>
              <span>/</span>
              <span className="hover:text-black">{product.category.sub}</span>
            </>
          )}
          <span>/</span>
          <span className="text-black font-medium truncate max-w-[220px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ১. মেইন প্রোডাক্ট সেকশন */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* বাম কলাম (৭ কলাম) */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/13] bg-[#F7F7F7] border border-gray-200 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryImages[activeImgIndex]}
                  src={galleryImages[activeImgIndex]}
                  alt={product.name}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-contain sm:object-cover"
                />
              </AnimatePresence>

              {product.badge && (
                <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  {product.badge}
                </span>
              )}

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-black hover:text-white text-black border border-gray-200 flex items-center justify-center transition-colors shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-black hover:text-white text-black border border-gray-200 flex items-center justify-center transition-colors shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white hover:bg-black hover:text-white text-black border border-gray-200 flex items-center justify-center shadow-sm transition-colors"
                title="Zoom Image"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 overflow-hidden bg-[#F7F7F7] transition-all ${
                      activeImgIndex === idx
                        ? 'border-black opacity-100'
                        : 'border-gray-200 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#CB006B]" /> WBB Quality Assurance
              </p>
              <div className="flex flex-wrap gap-2">
                {highlightTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-[#F7F7F7] border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 divide-y divide-gray-200">
              {accordions.map((acc) => {
                const isOpen = openAccordion === acc.id;
                return (
                  <div key={acc.id}>
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? '' : acc.id)}
                      className="w-full py-4 flex items-center justify-between text-left hover:text-[#CB006B] transition-colors"
                    >
                      <span className="text-sm font-bold text-black tracking-wide">
                        {acc.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
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

          {/* ডান কলাম (৫ কলাম) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                {product.category?.sub || product.category?.main || 'White Birch Beauty'}
              </p>
              <h1 className="text-2xl sm:text-[26px] font-bold text-black leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-2">
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
                <span className="text-xs text-gray-500">
                  ({reviewsList.length} Reviews)
                </span>
              </div>

              <p className="text-2xl font-black text-black mt-3">
                €{Number(product.price).toFixed(2)}
              </p>
            </div>

            <div className="bg-[#F6F5F3] border border-gray-200 p-3.5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#CB006B]" /> WBB Beauty Rewards
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Earn <strong>{Math.round(Number(product.price) * 10)} points</strong> with this purchase & unlock exclusive gifts.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            </div>

            {/* শেড সিলেক্টর (কালারের নাম ও সোয়াচসহ — অবজেক্ট ও স্ট্রিং উভয় সাপোর্ট) */}
            {product.shades && product.shades.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                  Shade: <span className="text-black">{selectedShade}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.shades.map((shadeItem, idx) => {
                    const isObj = typeof shadeItem === 'object' && shadeItem !== null;
                    const name = isObj ? shadeItem.name : String(shadeItem);
                    const colorCode = isObj
                      ? shadeItem.color
                      : typeof shadeItem === 'string' && shadeItem.startsWith('#')
                      ? shadeItem
                      : null;
                    const isActive = selectedShade === name;

                    return colorCode ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedShade(name)}
                        style={{ backgroundColor: colorCode }}
                        className={`w-8 h-8 rounded-full border transition-transform ${
                          isActive
                            ? 'ring-2 ring-offset-2 ring-black scale-105 border-white'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        title={name}
                        aria-label={name}
                      />
                    ) : (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedShade(name)}
                        className={`px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                          isActive
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-700 hover:border-black'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">
                QUANTITY:
              </label>
              <div className="inline-flex items-center border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-stretch gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleAddToBag}
                className="flex-1 bg-[#111111] hover:bg-[#CB006B] text-white h-12 px-6 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                {addedFeedback ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
              </button>

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'border-[#CB006B] text-[#CB006B] bg-[#CB006B]/5'
                    : 'border-gray-300 text-black hover:border-black'
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-[#CB006B]' : ''}`}
                />
              </button>
            </div>

            <p className="text-xs text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
              In stock, ready to be shipped within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* ২. FREQUENTLY BOUGHT TOGETHER বান্ডেল সেকশন */}
      {companionProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-gray-200">
          <h2 className="text-base font-bold text-black mb-6">
            Frequently Bought Together
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 border border-gray-200 divide-y divide-gray-200 bg-white">
              <div className="p-4 flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={bundleChecked.main}
                  onChange={(e) =>
                    setBundleChecked((prev) => ({ ...prev, main: e.target.checked }))
                  }
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover border border-gray-100 bg-gray-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">
                    This Item
                  </p>
                  <p className="text-xs font-bold text-black truncate">
                    {product.name}
                  </p>
                  <p className="text-xs font-black text-black mt-1">
                    €{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                  +
                </span>
              </div>

              <div className="p-4 flex items-center gap-4 bg-[#FAFAFA]">
                <input
                  type="checkbox"
                  checked={bundleChecked.companion}
                  onChange={(e) =>
                    setBundleChecked((prev) => ({
                      ...prev,
                      companion: e.target.checked
                    }))
                  }
                  className="w-4 h-4 accent-black cursor-pointer"
                />
                <Link to={`/product/${companionProduct._id}`} className="shrink-0">
                  <img
                    src={companionProduct.image}
                    alt={companionProduct.name}
                    className="w-16 h-16 object-cover border border-gray-100 bg-white"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">
                    Recommended Pairing
                  </p>
                  <Link
                    to={`/product/${companionProduct._id}`}
                    className="text-xs font-bold text-black hover:text-[#CB006B] truncate block"
                  >
                    {companionProduct.name}
                  </Link>
                  <p className="text-xs font-black text-black mt-1">
                    €{Number(companionProduct.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:pl-8">
              <p className="text-xs text-gray-500">Total Price:</p>
              <p className="text-xl font-black text-black mt-0.5">
                €{bundleTotal.toFixed(2)}
              </p>
              <button
                type="button"
                disabled={bundleTotal === 0}
                onClick={handleAddBundleToBag}
                className="mt-4 bg-[#111111] hover:bg-[#CB006B] disabled:bg-gray-300 text-white px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                {bundleAdded ? 'ADDED TO BAG ✓' : 'ADD BOTH TO BAG'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ৩. REVIEWS & QUESTIONS সেকশন */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-gray-200 space-y-10">
        <div>
          <h2 className="text-lg font-bold text-black">Reviews</h2>
          <p className="text-xs text-gray-600 mt-3 mb-2">Rate this Product</p>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hoverRating || selectedRating);
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className={`w-10 h-10 border flex items-center justify-center transition-colors ${
                    filled
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-400 hover:border-black'
                  }`}
                >
                  <Star className={`w-4 h-4 ${filled ? 'fill-white' : ''}`} />
                </button>
              );
            })}
          </div>

          {selectedRating > 0 && (
            <form
              onSubmit={handleReviewSubmit}
              className="mt-4 max-w-lg p-4 border border-gray-200 bg-[#FAFAFA] space-y-3"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
              <textarea
                rows="3"
                required
                placeholder="Share your thoughts about this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border border-gray-300 bg-white p-3 text-xs focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="bg-black hover:bg-[#CB006B] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}

          <div className="mt-6 space-y-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-black">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-black text-black" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-black">{rev.name}</span>
                  <span className="text-[11px] text-gray-400">• {rev.date}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-black mb-3">Questions</h2>
          <button
            type="button"
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="bg-[#111111] hover:bg-[#CB006B] text-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors"
          >
            ASK A QUESTION
          </button>

          {showQuestionForm && (
            <form
              onSubmit={handleQuestionSubmit}
              className="mt-4 max-w-lg flex gap-2"
            >
              <input
                type="text"
                required
                placeholder="Type your question about this product..."
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                className="flex-1 border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
              >
                Post
              </button>
            </form>
          )}

          <div className="mt-5 space-y-3">
            {questionsList.map((item) => (
              <div key={item.id} className="text-xs space-y-1">
                <p className="font-bold text-black">Q: {item.q}</p>
                <p className="text-gray-600">A: {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৪. OTHER CUSTOMERS BOUGHT গ্রিড */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-gray-200">
          <h2 className="text-center text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-black mb-10">
            OTHER CUSTOMERS BOUGHT
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col justify-between border border-transparent hover:border-gray-200 p-2 transition-colors"
              >
                <div>
                  <div className="relative aspect-square bg-[#F7F7F7] overflow-hidden mb-3">
                    <Link to={`/product/${item._id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <span className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-[8px] font-black uppercase text-black">
                      WBB
                    </span>

                    <button
                      type="button"
                      className="absolute top-2.5 right-2.5 text-gray-600 hover:text-[#CB006B] transition-colors"
                      aria-label="Wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/product/${item._id}`}
                    className="text-xs font-medium text-black hover:text-[#CB006B] line-clamp-2 leading-snug min-h-[34px]"
                  >
                    {item.name}
                  </Link>

                  <div className="mt-2">
                    <span className="inline-block border border-gray-300 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-600">
                      {item.badge || item.category?.sub || 'BESTSELLER'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-black text-black" />
                    ))}
                    <span className="text-[10px] text-gray-500 ml-1">
                      ({item.reviews || 12})
                    </span>
                  </div>

                  <p className="text-xs font-black text-black mt-1.5 mb-3">
                    €{Number(item.price).toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart && addToCart(item, 1)}
                  className="w-full bg-[#111111] hover:bg-[#CB006B] text-white py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  ADD TO BAG
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ফুলস্ক্রিন জুম লাইটবক্স */}
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
              className="absolute top-5 right-5 text-white hover:text-[#CB006B] p-2"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={galleryImages[activeImgIndex]}
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