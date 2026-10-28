import Hero from '../Home/Hero';
import ReviewSection from '../Pages/ReviewSection';
import ShopTheLook from '../Pages/ShopTheLook';
import BannerPromotion from './BannerPromotion';
import CategoryShowcase from './CategoryShowcase';
import LuxuryBeauty from './LuxuryBeauty';
import TrendingMarquee from './TrendingMarquee';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <LuxuryBeauty/>
      <BannerPromotion/>
      <CategoryShowcase/>
      <TrendingMarquee/>
      <ShopTheLook/>
      <ReviewSection/>
    </div>
  );
}