import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineArrowNarrowLeft, HiOutlineSparkles, HiOutlineArrowDown, HiGlobeAlt, HiLocationMarker, HiUserGroup } from 'react-icons/hi';
import FeaturedTrips from '../components/FeaturedTrips';
import { SEO, getBreadcrumbSchema } from '../seo';

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const scrollToFeatured = (category = 'All') => {
    setSelectedCategory(category);
    setTimeout(() => {
      document.getElementById('featured-trips-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCustomClick = () => {
    navigate('/contact', { state: { customTrip: true } });
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Destinations & Trips', path: '/destinations' }
  ];

  return (
    <>
      <SEO 
        title="Curated Tour Packages & Destinations"
        description="Explore luxury domestic and international holiday tour packages with Desi Journey. Handcrafted itineraries for Andaman, Kashmir, Arunachal, Bali, Kerala and beyond."
        canonical="/destinations"
        keywords={['curated tour packages', 'domestic holiday packages india', 'international travel packages', 'andaman trips', 'kashmir tour packages']}
        schema={getBreadcrumbSchema(breadcrumbs)}
      />

      <section className="relative overflow-hidden bg-ink pt-32 pb-16 text-white">
        <div className="hero-mesh absolute inset-0 opacity-40" />

        <div className="container-luxe relative space-y-8">
          {/* Top navigation back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-cyan hover:text-white transition">
            <HiOutlineArrowNarrowLeft size={16} /> Home
          </Link>

          <div>
            <p className="eyebrow !text-cyan">Our Curated Catalog</p>
            <h1 className="display-font max-w-3xl text-4xl sm:text-6xl leading-tight">
              Where do you want your story to begin?
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-white/70">
              Select an option below to filter our handpicked collection, or let us craft a completely custom itinerary for you.
            </p>
          </div>

          {/* 3 Prominent Category Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Option 1: Domestic */}
            <div 
              onClick={() => scrollToFeatured('Domestic')}
              className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 cursor-pointer border transition-all duration-300 ${
                selectedCategory === 'Domestic' 
                  ? 'border-cyan bg-white/15 shadow-2xl scale-[1.02]' 
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="absolute inset-0 -z-10 opacity-30 group-hover:opacity-40 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" 
                  alt="Domestic Escapes" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
              </div>

              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan/20 text-cyan text-xs font-bold rounded-full border border-cyan/30">
                  <HiLocationMarker /> 1. Domestic Escapes
                </span>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-cyan transition-colors">
                  Domestic Trips
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Andaman, Kashmir, Ladakh, Arunachal, Meghalaya, Kerala, Sundarban & Spiti Valley.
                </p>
                <button 
                  type="button"
                  className="w-full mt-2 py-3 bg-white/10 hover:bg-cyan hover:text-ink text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-white/15"
                >
                  Browse Domestic Trips →
                </button>
              </div>
            </div>

            {/* Option 2: International */}
            <div 
              onClick={() => scrollToFeatured('International')}
              className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 cursor-pointer border transition-all duration-300 ${
                selectedCategory === 'International' 
                  ? 'border-cyan bg-white/15 shadow-2xl scale-[1.02]' 
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="absolute inset-0 -z-10 opacity-30 group-hover:opacity-40 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" 
                  alt="International Escapes" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
              </div>

              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                  <HiGlobeAlt /> 2. International Escapes
                </span>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  International Trips
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Bali Private Villas, Vietnam & Angkor Wat, Kenya Great Migration Safaris & global wonder.
                </p>
                <button 
                  type="button"
                  className="w-full mt-2 py-3 bg-white/10 hover:bg-amber-400 hover:text-ink text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-white/15"
                >
                  Browse International Trips →
                </button>
              </div>
            </div>

            {/* Option 3: Custom */}
            <div 
              onClick={handleCustomClick}
              className="group relative overflow-hidden rounded-3xl p-6 sm:p-8 cursor-pointer border border-white/10 bg-white/5 hover:border-cyan/50 hover:bg-white/10 transition-all duration-300"
            >
              <div className="absolute inset-0 -z-10 opacity-30 group-hover:opacity-40 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" 
                  alt="Tailor-Made Custom Trips" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
              </div>

              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-400/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
                  <HiUserGroup /> 3. Tailor-Made
                </span>
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Custom Trips
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Bespoke itineraries designed around your exact dates, group size, budget, and travel style.
                </p>
                <button 
                  type="button"
                  className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  Plan Custom Itinerary →
                </button>
              </div>
            </div>
          </div>

          {/* Peeking Note Banner */}
          <div className="pt-8 text-center">
            <button
              onClick={() => scrollToFeatured(selectedCategory)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-cyan/30 text-cyan rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg group"
            >
              <HiOutlineSparkles className="text-amber-400 animate-spin" /> 
              Scroll down to see our featured trips 
              <HiOutlineArrowDown className="group-hover:translate-y-1 transition-transform animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Trips Collection */}
      <FeaturedTrips all selectedCategory={selectedCategory} />
    </>
  );
}
