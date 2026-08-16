import { useState, useEffect } from 'react';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SectionHeading from './SectionHeading';

const reviews = [
  {
    quote: 'The itinerary was beautifully paced. Every hotel felt chosen just for us, and the little surprises made the trip unforgettable.',
    name: 'Ananya & Rishi',
    city: 'Kolkata',
    rating: 5
  },
  {
    quote: 'They understood exactly what "easy" travel meant for our family. The transfers, stays, and days all simply flowed.',
    name: 'Suman D.',
    city: 'Bengaluru',
    rating: 5
  },
  {
    quote: 'Our Kashmir honeymoon had the right mix of romance and adventure. We came home with stories, not just photographs.',
    name: 'Maitreyi S.',
    city: 'Mumbai',
    rating: 5
  }
];

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const current = reviews[activeIndex];

  return (
    <section className="section-space overflow-hidden bg-mist">
      <div className="container-luxe grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div>
          <SectionHeading 
            eyebrow="In their words" 
            title="Loved by travellers" 
            text="The kind of reviews that matter most: the ones written long after the bags are unpacked." 
          />
          <div className="mt-8 flex items-center gap-4">
            <span className="display-font text-5xl text-ink">4.9</span>
            <span>
              <span className="flex text-[#d49b3b]">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} size={18} />
                ))}
              </span>
              <small className="mt-1 block text-xs font-semibold text-ink/55">
                Based on Google reviews
              </small>
            </span>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-white bg-white/60 p-4 shadow-xl shadow-ocean/5">
          <figure className="min-h-[250px] rounded-[1.5rem] bg-ink p-8 sm:p-10 text-white flex flex-col justify-between transition-all duration-500">
            <div>
              <span className="display-font text-6xl leading-none text-cyan/60 block -mb-4">“</span>
              <blockquote className="text-base sm:text-lg leading-relaxed text-white/90 font-medium">
                {current.quote}
              </blockquote>
            </div>

            <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
              <figcaption className="text-sm font-bold text-white">
                {current.name}
                <span className="ml-2 font-normal text-white/50">· {current.city}</span>
              </figcaption>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous review"
                >
                  <HiChevronLeft size={18} />
                </button>
                <span className="text-xs font-mono text-white/50 px-1">
                  {activeIndex + 1}/{reviews.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next review"
                >
                  <HiChevronRight size={18} />
                </button>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
