import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const defaultCampaigns = [
  {
    id: 1,
    title: 'White Birch Beauty Eyeliner',
    subtitle: 'Flawless base for all day wear',
    modelImage: 'https://res.cloudinary.com/wtbwxhmc/image/upload/v1793166069/image.png_17b1d13c_2K_v8zjwl.jpg',
    imagePosition: 'left',
    defaultLink: '/shop?sub=Eyes',
    keywords: ['eye', 'eyes', 'eyeliner', 'eye liner', 'liner', 'mascara', 'eyeshadow', 'brow', 'kajal'],
    defaultProducts: [
      {
        _id: '65a1b2c3d4e5f6g7h8',
        name: 'Scandal Eyes',
        image: 'https://res.cloudinary.com/wtbwxhmc/image/upload/v1793166532/image.png_3065c075_2K_twbbgn.jpg',
        isFallback: true
      },
      {
        _id: '65b2c3d4e5f6g7h8i9',
        name: 'Radiant Setting Powder',
        image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=500',
        isFallback: true
      }
    ]
  },
  {
    id: 2,
    title: 'THE PERFECT POUT',
    subtitle: 'Bold lips that make a statement',
    modelImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000',
    imagePosition: 'right',
    defaultLink: '/shop?sub=Lips',
    keywords: ['lip', 'lips', 'lipstick', 'lip gloss', 'lip liner', 'lip balm', 'tint'],
    defaultProducts: [
      {
        _id: '65c3d4e5f6g7h8i9j0',
        name: 'Velvet Matte Lipstick',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500',
        isFallback: true
      },
      {
        _id: '65d4e5f6g7h8i9j0k1',
        name: 'Precision Lip Liner',
        image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=500',
        isFallback: true
      }
    ]
  }
];

export default function ShopTheLook() {
  const [campaigns, setCampaigns] = useState(
    defaultCampaigns.map((camp) => ({
      ...camp,
      routineLink: camp.defaultLink,
      products: camp.defaultProducts
    }))
  );

  useEffect(() => {
    const fetchLookProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/products`);
        if (!response.ok) return;

        const data = await response.json();
        const productsList = Array.isArray(data) ? data : data.products || [];

        const updatedCampaigns = defaultCampaigns.map((camp) => {
          // ডাটাবেস থেকে ওই ক্যাটাগরির প্রোডাক্টগুলো খুঁজে বের করা
          const matchedProducts = productsList.filter((p) => {
            const catText =
              typeof p.category === 'object' && p.category !== null
                ? Object.values(p.category).filter(Boolean).join(' ')
                : String(p.category || '');

            const searchableText = `${catText} ${p.name || ''}`.toLowerCase();
            return camp.keywords.some((kw) => searchableText.includes(kw));
          });

          // ডাইনামিক ক্যাটাগরি লিংক (Shop The Routine বাটনের জন্য)
          let routineLink = camp.defaultLink;
          if (matchedProducts.length > 0 && matchedProducts[0].category) {
            const firstCat = matchedProducts[0].category;
            if (firstCat.sub) {
              routineLink = `/shop?sub=${encodeURIComponent(firstCat.sub)}`;
            } else if (firstCat.main) {
              routineLink = `/shop?main=${encodeURIComponent(firstCat.main)}`;
            }
          }

          // সর্বোচ্চ ২টি প্রোডাক্ট দেখাবে (ডাটাবেসে ১টি থাকলে, ২য়টি ডিফল্ট থেকে নেবে; ০টি থাকলে ২টিই ডিফল্ট থাকবে)
          let finalProducts = camp.defaultProducts;
          if (matchedProducts.length >= 2) {
            finalProducts = matchedProducts.slice(0, 2);
          } else if (matchedProducts.length === 1) {
            finalProducts = [matchedProducts[0], camp.defaultProducts[1]];
          }

          return {
            ...camp,
            routineLink,
            products: finalProducts
          };
        });

        setCampaigns(updatedCampaigns);
      } catch (error) {
        console.error('Error fetching ShopTheLook products:', error);
      }
    };

    fetchLookProducts();
  }, []);

  return (
    <section className="w-full bg-white py-20 border-t border-gray-100">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl poppins-bold-italic tracking-tighter text-black uppercase">
            GET THE <span className="text-[#CB006B]">LOOK</span>
          </h2>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-4">
            Shop our signature routines
          </p>
        </div>

        {/* Campaign Blocks */}
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className={`grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center ${
              campaign.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Model Image Section: Medium-Large (6 columns) and 1:1 Aspect Ratio */}
            <div
              className={`md:col-span-6 flex flex-col items-center text-center ${
                campaign.imagePosition === 'right' ? 'md:order-last' : ''
              }`}
            >
              <div className="w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden mb-6 relative group flex items-center justify-center cursor-pointer shadow-sm">
                <img
                  src={campaign.modelImage}
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-500 z-10 rounded-3xl"></div>

                {/* ১ম কার্ডে ক্লিক করলে Eyes-এ এবং ২য় কার্ডে ক্লিক করলে Lips-এ যাবে */}
                <Link
                  to={campaign.routineLink}
                  className="z-20 border-2 border-white px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 rounded-full"
                >
                  Shop The Routine
                </Link>
              </div>

              <h3 className="text-xl poppins-semibold-italic uppercase tracking-widest text-black">
                {campaign.title}
              </h3>
              <p className="text-[10px] text-gray-500 mt-2 font-bold tracking-widest uppercase">
                {campaign.subtitle}
              </p>
            </div>

            {/* Products Section: Balanced (6 columns) */}
            <div className="md:col-span-6 grid grid-cols-2 gap-6 lg:gap-8 px-4">
              {campaign.products.map((product, pIdx) => (
                <Link
                  key={product._id || pIdx}
                  to={product.isFallback ? campaign.routineLink : `/product/${product._id}`}
                  className="group flex flex-col items-center text-center cursor-pointer transition-all"
                >
                  {/* Clean Small Product Image */}
                  <div className="w-full aspect-square mb-4 overflow-hidden bg-transparent flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[75%] h-[75%] object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                    />
                  </div>

                  {/* Clean Product Name */}
                  <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-black line-clamp-2 group-hover:text-[#CB006B] transition-colors leading-relaxed">
                    {product.name}
                  </h4>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}