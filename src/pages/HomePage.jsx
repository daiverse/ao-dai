import React from "react";
import HeroBanner from "../components/home/HeroBanner";
import CollectionCards from "../components/home/CollectionCards";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Interactive360Preview from "../components/home/Interactive360Preview";
import StoryHeritage from "../components/home/StoryHeritage";

export default function HomePage({ onNavigate, onTryOn, onRotate360 }) {
  return (
    <div className="space-y-0">
      <HeroBanner onNavigate={onNavigate} />
      <CollectionCards onSelectCollection={() => onNavigate("products")} />
      <FeaturedProducts onTryOn={onTryOn} onRotate360={onRotate360} />
      <Interactive360Preview onNavigateTo360={() => onNavigate("360")} />
      <StoryHeritage onNavigate={onNavigate} />
    </div>
  );
}
