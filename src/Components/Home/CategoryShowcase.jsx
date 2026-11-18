import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const defaultCategories = [
  {
    id: 1,
    title: 'Eyes',
    defaultQuery: '?sub=Eyes',
    keywords: ['eye', 'eyes', 'eyeliner', 'eye liner', 'liner', 'mascara', 'eyeshadow', 'brow', 'kajal'],
    defaultImage: 'https://res.cloudinary.com/wtbwxhmc/image/upload/v1794812766/image.png_7f94d3a8_mo6bms.jpg',
  },
  {
    id: 2,
    title: 'Lips',
    defaultQuery: '?sub=Lips',
    keywords: ['lip', 'lips', 'lipstick', 'lip gloss', 'lip liner', 'lip balm', 'tint'],
    defaultImage: 'https://images.unsplash.com/photo-1626895872564-b691b6877b83?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    id: 3,
    title: 'Face',
    defaultQuery: '?sub=Face',
    keywords: ['face', 'foundation', 'concealer', 'blush', 'primer', 'powder', 'highlighter', 'contour'],
    defaultImage: 'https://res.cloudinary.com/wtbwxhmc/image/upload/v1793166532/image.png_3065c075_2K_twbbgn.jpg',
  },
  {
    id: 4,
    title: 'Skincare',
    defaultQuery: '?main=Skincare',
    keywords: ['skincare', 'skin care', 'serum', 'cleanser', 'moisturizer', 'toner', 'sunscreen', 'cream'],
    defaultImage: 'https://plus.unsplash.com/premium_photo-1708271587288-0d8c58bda098?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
];

export default function CategoryShowcase() {
  const [categoryCards, setCategoryCards] = useState(
    defaultCategories.map((cat) => ({
      ...cat,
      image: cat.defaultImage,
      query: cat.defaultQuery,
    }))
  );

  useEffect(() => {
    const fetchDynamicCategoryImages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/products`);
        if (!response.ok) return;

        const data = await response.json();
        const productsList = Array.isArray(data) ? data : data.products || [];

        const updatedCards = defaultCategories.map((cat) => {
          const matchedProduct = productsList.find((p) => {
            const catText =
              typeof p.category === 'object' && p.category !== null
                ? Object.values(p.category).filter(Boolean).join(' ')
                : String(p.category || '');

            const searchableText = `${catText} ${p.name || ''}`.toLowerCase();
            return cat.keywords.some((kw) => searchableText.includes(kw));
          });

          // ডাটাবেসে যে এক্সাক্ট ক্যাটাগরি নাম (Capital সহ) আছে, সেটি দিয়েই ডাইনামিক লিংক তৈরি হবে
          let dynamicQuery = cat.defaultQuery;
          if (matchedProduct?.category) {
            if (matchedProduct.category.sub) {
              dynamicQuery = `?sub=${encodeURIComponent(matchedProduct.category.sub)}`;
            } else if (matchedProduct.category.main) {
              dynamicQuery = `?main=${encodeURIComponent(matchedProduct.category.main)}`;
            }
          }

          return {
            ...cat,
            image: matchedProduct?.image || matchedProduct?.images?.[0] || cat.defaultImage,
            query: dynamicQuery,
          };
        });

        setCategoryCards(updatedCards);
      } catch (error) {
        console.error('Error loading dynamic category images:', error);
      }
    };

    fetchDynamicCategoryImages();
  }, []);

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-400 mx-auto">
        {/* Simple & Elegant Header */}
        <div className="flex justify-center mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl poppins-bold-italic tracking-tighter uppercase text-black"
          >
            Shop By <span className="text-[#CB006B]">Category</span>
          </motion.h2>
        </div>

        {/* Categories Grid (Dynamic with Default Fallback) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categoryCards.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/shop${category.query}`}
                className="group flex flex-col items-center cursor-pointer w-full"
              >
                {/* Clean Square Image */}
                <div className="w-full aspect-square overflow-hidden mb-4 bg-gray-50">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>

                {/* Category Title Below Image */}
                <h3 className="text-xs md:text-[13px] text-black font-medium tracking-wide">
                  {category.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}