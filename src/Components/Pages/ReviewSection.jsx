import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, CheckCircle2, ShieldCheck, X, Sparkles } from 'lucide-react';

// ডামি রিভিউ ডেটা
const initialReviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    rating: 5,
    comment: "Absolutely in love with the Lumina Glow Foundation! It blends seamlessly into the skin and lasts all day without feeling heavy or oily. Truly a luxury staple!",
    date: "15 Oct 2026",
    role: "User",
    verified: true
  },
  {
    id: 2,
    name: "WBB Official",
    rating: 5,
    comment: "Thank you all for the overwhelming love on our new arrivals! We craft every formula to deliver the highest luxury and skin-loving experience.",
    date: "12 Oct 2026",
    role: "Admin",
    verified: true
  },
  {
    id: 3,
    name: "Emily R.",
    rating: 5,
    comment: "The Velvet Matte Lipstick color payoff is gorgeous. Long-lasting, creamy texture and feels ultra-comfortable on the lips all day long.",
    date: "10 Oct 2026",
    role: "User",
    verified: true
  }
];

export default function ReviewSection() {
  const [reviews, setReviews] = useState(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // ফর্ম স্টেট
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [hoveredStar, setHoveredStar] = useState(0);

  // স্টার রেটিং অনুযায়ী টেক্সট লেবেল
  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent!"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    const reviewObj = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      role: newReview.name.toLowerCase().includes('admin') ? 'Admin' : 'User',
      verified: true
    };

    setReviews([reviewObj, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '' });
    setIsFormOpen(false);
  };

  return (
    <section className="w-full bg-[#FAF9F6] py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-200/60">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Rating Summary */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#CB006B] text-[11px] font-bold tracking-[0.3em] uppercase mb-3 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Client Testimonials
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl poppins-bold-italic tracking-tighter uppercase text-black mb-6"
          >
            Loved by <span className="italic text-[#CB006B]">Beauty</span> Lovers
          </motion.h2>

          {/* Rating Summary Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-gray-200/80 shadow-sm"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#CB006B] text-[#CB006B]" />
              ))}
            </div>
            <span className="text-xs font-bold tracking-wider text-black">4.9 OUT OF 5</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500 font-medium">{reviews.length} Verified Reviews</span>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence>
            {reviews.map((review, index) => {
              const isAdmin = review.role === 'Admin';
              const initialLetter = review.name.charAt(0).toUpperCase();

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-8 bg-white border transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 ${
                    isAdmin 
                      ? 'border-black bg-gradient-to-b from-gray-900 to-black text-white' 
                      : 'border-gray-200/80 text-gray-800'
                  }`}
                >
                  <div>
                    {/* Top Row: Stars & Date */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? (isAdmin ? 'fill-pink-400 text-pink-400' : 'fill-[#CB006B] text-[#CB006B]') 
                                : (isAdmin ? 'fill-gray-800 text-gray-800' : 'fill-gray-100 text-gray-200')
                            }`} 
                          />
                        ))}
                      </div>
                      <span className={`text-[11px] font-medium ${isAdmin ? 'text-gray-400' : 'text-gray-400'}`}>
                        {review.date}
                      </span>
                    </div>

                    {/* Review Comment */}
                    <p className={`text-sm leading-relaxed mb-8 font-light italic ${isAdmin ? 'text-gray-200' : 'text-gray-700'}`}>
                      "{review.comment}"
                    </p>
                  </div>

                  {/* User Profile Info */}
                  <div className={`flex items-center gap-3.5 pt-5 border-t ${isAdmin ? 'border-gray-800' : 'border-gray-100'}`}>
                    {/* Avatar Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase tracking-wider ${
                      isAdmin 
                        ? 'bg-[#CB006B] text-white shadow-lg' 
                        : 'bg-pink-50 text-[#CB006B] border border-pink-100'
                    }`}>
                      {initialLetter}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isAdmin ? 'text-white' : 'text-black'}`}>
                          {review.name}
                        </span>
                        {isAdmin ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#CB006B]" />
                        )}
                      </div>

                      <span className={`text-[10px] uppercase tracking-widest font-semibold mt-0.5 ${
                        isAdmin ? 'text-pink-400' : 'text-gray-400'
                      }`}>
                        {isAdmin ? 'WBB Official Team' : 'Verified Buyer'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Action Button & Modal Form */}
        <div className="flex flex-col items-center">
          {!isFormOpen ? (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFormOpen(true)}
              className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#CB006B] transition-all duration-300 flex items-center gap-3 shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              Write A Review
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white p-8 md:p-12 shadow-2xl border border-gray-200 relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <span className="text-[#CB006B] text-[10px] font-bold tracking-[0.3em] uppercase block mb-2">Share Your Experience</span>
                <h3 className="text-2xl font-light uppercase tracking-tight text-black" style={{ fontFamily: "Georgia, serif" }}>
                  Leave Your <span className="italic text-[#CB006B]">Feedback</span>
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Interactive Star Rating Selector */}
                <div className="flex flex-col items-center bg-pink-50/50 p-6 rounded-lg border border-pink-100">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Select Rating: <span className="text-[#CB006B] font-bold">{ratingLabels[(hoveredStar || newReview.rating) - 1]}</span>
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-125 duration-200"
                      >
                        <Star 
                          className={`w-8 h-8 transition-colors ${
                            star <= (hoveredStar || newReview.rating) 
                              ? 'fill-[#CB006B] text-[#CB006B]' 
                              : 'fill-gray-200 text-gray-200'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1.5">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sophia Loren" 
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#CB006B] focus:bg-white text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1.5">Your Review</label>
                    <textarea 
                      placeholder="How was your experience with WBB products?" 
                      rows="4"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#CB006B] focus:bg-white text-sm resize-none transition-all"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 border border-gray-300 text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#CB006B] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}