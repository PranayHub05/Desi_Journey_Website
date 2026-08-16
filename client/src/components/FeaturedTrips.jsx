import { Link } from 'react-router-dom';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import SectionHeading from './SectionHeading';
import TourCard from './TourCard';
import { useTours } from '../hooks/useTours';

export default function FeaturedTrips({ all = false, selectedCategory = 'All' }) {
  const { tours, loading, error } = useTours();
  
  if (loading) {
    return <div className="text-center py-20 text-ink/60 font-bold text-sm animate-pulse">Loading trips...</div>;
  }

  const safeTours = Array.isArray(tours) ? tours : [];

  let filteredTours = safeTours;
  if (selectedCategory && selectedCategory !== 'All') {
    filteredTours = safeTours.filter((t) => (t && t.category || '').toLowerCase() === selectedCategory.toLowerCase());
  }

  const shownTours = all ? filteredTours : filteredTours.slice(0, 6);

  return (
    <section id="featured-trips-section" className="section-space bg-sand">
      <div className="container-luxe">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading 
            eyebrow={selectedCategory !== 'All' ? `${selectedCategory} Collection` : "The collection"} 
            title={selectedCategory !== 'All' ? `${selectedCategory} Trips` : "Featured trips"} 
            text="Handpicked journeys crafted with care by Desi Journey." 
          />
          <p className="max-w-xs text-sm leading-6 text-ink/55">
            Every itinerary is a starting point. We tailor its rhythm, stay, and smallest details around you.
          </p>
        </div>

        {error ? (
          <div className="mt-12 text-center text-red-500 font-medium">Failed to load trips.</div>
        ) : shownTours.length === 0 ? (
          <div className="mt-12 p-8 text-center bg-white rounded-3xl border border-ink/5 text-ink/60">
            No {selectedCategory} trips currently available. Explore all our trips below!
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shownTours.map((tour, index) => (
              <TourCard key={tour?.id || tour?.title || index} tour={tour} index={index} />
            ))}
          </div>
        )}

        {!all && (
          <div className="mt-12 text-center">
            <Link to="/destinations" className="outline-button">
              Explore more trips <HiOutlineArrowNarrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
