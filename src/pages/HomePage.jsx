import React from "react";
import HeroBanner from "../components/home/HeroBanner";
import CollectionCards from "../components/home/CollectionCards";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Interactive360Preview from "../components/home/Interactive360Preview";
import BrandTimeline from "../components/home/BrandTimeline";
import StoryHeritage from "../components/home/StoryHeritage";
import Testimonials from "../components/home/Testimonials";

export default function HomePage({ onNavigate, onTryOn, onRotate360 }) {
  return (
    <div className="bg-[#EBE9E1]">
      {/* 1. Hero Banner */}
      <HeroBanner onNavigate={onNavigate} />

      {/* 2. Collection Cards */}
      <CollectionCards onSelectCollection={() => onNavigate("products")} />

      {/* 3. Featured Products */}
      <FeaturedProducts onTryOn={onTryOn} onRotate360={onRotate360} />

      {/* 4. Interactive 360 Preview (Dark Accent Section) */}
      <Interactive360Preview onNavigateTo360={() => onNavigate("360")} />

      {/* 5. Brand Timeline */}
      <BrandTimeline />

      {/* 6. Story Heritage */}
      <StoryHeritage onNavigate={onNavigate} />

      {/* 7. Customer Testimonials */}
      <Testimonials />
    </div>
  );
}
