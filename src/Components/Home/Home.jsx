import Hero from '../Home/Hero';
import CategoryShowcase from './CategoryShowcase';
import LuxuryBeauty from './LuxuryBeauty';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <LuxuryBeauty/>|
      <CategoryShowcase/>
    </div>
  );
}