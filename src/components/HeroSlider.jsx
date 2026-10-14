
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const banners = [
  {
    eyebrow: "MAKE ROOM FOR COMFORT",
    title: "A home that feels like you.",
    description:
      "Thoughtfully chosen furniture for everyday living, relaxing, and making memories.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
    button: "Explore Collections",
    category: "living-room",
  },
  {
    eyebrow: "YOUR PERSONAL RETREAT",
    title: "Rest easy. Wake inspired.",
    description:
      "Create a bedroom that brings comfort and calm to your everyday routine.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85",
    button: "Explore Bedrooms",
    category: "bedroom",
  },
  {
    eyebrow: "DESIGNED FOR EVERYDAY LIFE",
    title: "Good design lives here.",
    description:
      "Discover versatile furniture that brings style and function together.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85",
    button: "Find Your Style",
    category: "living-room",
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured furniture collections">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        className="hero-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.title}>
            <div className="relative min-h-[420px] overflow-hidden bg-stone-200 sm:min-h-[500px] lg:min-h-[570px]">
              <img
                src={banner.image}
                alt="Furniture and interior inspiration"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

              <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-8 py-16 sm:min-h-[500px] sm:px-14 lg:min-h-[570px] lg:px-20">
                <div className="max-w-xl text-white">
                  <p className="mb-4 text-xs font-semibold tracking-[0.25em] sm:text-sm">
                    {banner.eyebrow}
                  </p>

                  <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    {banner.title}
                  </h1>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                    {banner.description}
                  </p>

                  <a
                    href={`/category/${banner.category}`}
                    className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#263E32] transition hover:bg-stone-200"
                  >
                    {banner.button} →
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
