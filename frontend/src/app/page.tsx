import { VideoGrid } from '@/components/video/VideoGrid';
import { HeroSection } from '@/components/home/HeroSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { RecommendedSection } from '@/components/home/RecommendedSection';
import { Suspense } from 'react';
import { VideoGridSkeleton } from '@/components/ui/VideoGridSkeleton';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trending Videos Section */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🔥 Trending Now
        </h2>
        <Suspense fallback={<VideoGridSkeleton count={8} />}>
          <TrendingSection />
        </Suspense>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          📂 Explore Categories
        </h2>
        <CategoriesSection />
      </section>

      {/* Recommended Videos Section */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          ✨ Recommended for You
        </h2>
        <Suspense fallback={<VideoGridSkeleton count={12} />}>
          <RecommendedSection />
        </Suspense>
      </section>

      {/* Latest Videos Section */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🆕 Latest Videos
        </h2>
        <Suspense fallback={<VideoGridSkeleton count={12} />}>
          <VideoGrid />
        </Suspense>
      </section>
    </div>
  );
}