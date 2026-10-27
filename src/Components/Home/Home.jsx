import Hero from '../Home/Hero';
import ReviewSection from '../Pages/ReviewSection';
import ShopTheLook from '../Pages/ShopTheLook';
import CategoryShowcase from './CategoryShowcase';
import LuxuryBeauty from './LuxuryBeauty';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <LuxuryBeauty/>|
      <CategoryShowcase/>
      <ShopTheLook/>
      <ReviewSection/>
    </div>
  );
}