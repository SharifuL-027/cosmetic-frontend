import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, UserCircle2, MessageSquare, CheckCircle2 } from 'lucide-react';

// ডামি রিভিউ ডেটা (ভবিষ্যতে ডাটাবেস থেকে আসবে)
const initialReviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    rating: 5,
    comment: "Absolutely in love with the Lumina Glow Foundation! It blends seamlessly and lasts all day without feeling heavy. Highly recommend!",
    date: "15 Oct 2026",
    role: "User"
  },
  {
    id: 2,
    name: "WBB",
    rating: 5,
    comment: "Thank you all for the overwhelming response on our new arrivals! We make sure every product meets the highest luxury standards.",
    date: "12 Oct 2026",
    role: "Admin" // অ্যাডমিন রিভিউ চেনার জন্য
  },
  {
    id: 3,
    name: "Emily R.",
    rating: 4,
    comment: "The Velvet Matte Lipstick color is gorgeous. It does dry out my lips just a tiny bit, but a lip balm underneath fixes it perfectly.",
    date: "10 Oct 2026",
    role: "User"
  }
];

export default function ReviewSection() {
  const [reviews, setReviews] = useState(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // ফর্ম স্টেট
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [hoveredStar, setHoveredStar] = useState(0);

  // রিভিউ সাবমিট হ্যান্ডলার (ভবিষ্যতে এখানে API POST Request বসবে)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const reviewObj = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      // সিম্পল লজিক: নামের সাথে 'Admin' থাকলে তাকে অ্যাডমিন ব্যাজ দেওয়া হবে
      role: newReview.name.toLowerCase().includes('admin') ? 'Admin' : 'User'
    };

    setReviews([reviewObj, ...reviews]); // নতুন রিভিউটি লিস্টের শুরুতে যোগ করা হলো
    setNewReview({ name: '', rating: 5, comment: '' });
    setIsFormOpen(false); // ফর্ম বন্ধ করে দেওয়া হলো
  };

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-300 mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#CB006B] text-xs font-bold tracking-[0.2em] uppercase mb-4"
          >
            Real Voices
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl poppins-bold-italic tracking-tighter text-black uppercase"
          >
            Customer <span className=" text-[#CB006B]">Reviews</span>
          </motion.h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`p-8 bg-white border-t-4 shadow-sm flex flex-col ${review.role === 'Admin' ? 'border-black' : 'border-[#CB006B]'}`}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'fill-[#CB006B] text-[#CB006B]' : 'fill-gray-200 text-gray-200'}`} 
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6 grow italic">
                  "{review.comment}"
                </p>

                {/* User Info */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <UserCircle2 className={`w-8 h-8 ${review.role === 'Admin' ? 'text-black' : 'text-gray-300'}`} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-black flex items-center gap-1.5">
                        {review.name}
                        {review.role === 'Admin' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#CB006B]" />
                        )}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium tracking-wider uppercase">
                        {review.role === 'Admin' ? 'Official WBB Admin' : 'Verified Buyer'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {review.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Write a Review Section */}
        <div className="flex flex-col items-center">
          {!isFormOpen ? (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#CB006B] transition-colors duration-300 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Write A Review
            </button>
          ) : (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full max-w-2xl bg-white p-8 md:p-10 shadow-md border border-gray-100"
              onSubmit={handleSubmit}
            >
              <h3 className="text-xl poppins-bold-italic tracking-tighter uppercase mb-6 text-center ">
                Leave Your Feedback
              </h3>
              
              {/* Rating Selector */}
              <div className="flex flex-col items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Your Rating</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredStar || newReview.rating) 
                            ? 'fill-[#CB006B] text-[#CB006B]' 
                            : 'fill-gray-100 text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name (e.g., Admin WBB or John Doe)" 
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#CB006B] text-sm transition-colors"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Tell us what you think..." 
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#CB006B] text-sm resize-none transition-colors"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 border-2 border-black text-black py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#CB006B] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Post Review
                </button>
              </div>
            </motion.form>
          )}
        </div>

      </div>
    </section>
  );
}