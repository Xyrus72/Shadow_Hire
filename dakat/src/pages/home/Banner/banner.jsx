import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const slides = [
  {
    title: 'Elite Freelancers',
    subtitle: 'Hire top-tier talent operating from the shadows',
    img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Secure & Stealthy',
    subtitle: 'Encrypted collaboration with zero noise',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Ship Faster',
    subtitle: 'Deploy bold ideas with world-class operators',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Anonymous Ops',
    subtitle: 'Your team, your talent, no questions asked',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
  },
]

const Banner = () => {
  return (
    <div className="w-full bg-black">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={4000}
        swipeable
        emulateTouch
        dynamicHeight={false}
        className="w-full shadow-[0_0_30px_rgba(0,255,65,0.3)] border-b-2 border-[#00ff41]/30"
      >
        {slides.map((slide) => (
          <div key={slide.title} className="relative h-[300px] md:h-[500px] lg:h-[600px]">
            <img
              src={slide.img}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
            {/* Neon accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent" />
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-6 md:p-12 space-y-3 text-left w-full md:max-w-2xl">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#00ff41] font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {slide.title}
              </h2>
              <p className="text-gray-300 md:text-lg lg:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-mono">
                {slide.subtitle}
              </p>
              <button className="mt-4 px-6 py-2 bg-[#00ff41] text-black font-mono font-bold rounded hover:bg-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.7)] hover:scale-105">
                Explore More
              </button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default Banner