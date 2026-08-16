import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineArrowNarrowLeft, 
  HiOutlineLocationMarker, 
  HiOutlineClock, 
  HiStar, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle,
  HiOutlineSparkles,
  HiPlus,
  HiMinus,
  HiOutlineCalendar,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { fetchTour } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [openDay, setOpenDay] = useState(1); // Default open Day 1

  useEffect(() => {
    fetchTour(id)
      .then((data) => {
        setTour(data);
        setActiveImage(data.image || '');
      })
      .catch((err) => setError(err.message || 'Failed to load tour details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-sand pt-36 pb-20 text-center container-luxe">
        <h2 className="text-3xl font-display text-ink mb-4">Tour Not Found</h2>
        <p className="text-ink/60 mb-8">The trip you are looking for might have been removed or updated.</p>
        <Link to="/destinations" className="gold-button">
          Explore All Destinations
        </Link>
      </div>
    );
  }

  const allImages = [tour.image, ...(tour.images || [])].filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages));

  const toggleDay = (dayNum) => {
    setOpenDay(openDay === dayNum ? null : dayNum);
  };

  return (
    <div className="min-h-screen bg-sand pt-28 pb-24">
      <div className="container-luxe space-y-12">
        {/* Back Link */}
        <Link to="/destinations" className="inline-flex items-center gap-2 text-sm font-bold text-ocean hover:text-ink transition">
          <HiOutlineArrowNarrowLeft size={18} /> Back to Destinations
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery Carousel Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-[400px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl bg-ink/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={tour.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-ink flex items-center gap-1.5 shadow-md">
                <HiStar className="text-[#d49b3b]" /> {tour.rating}
              </div>

              <div className="absolute bottom-4 right-4 bg-ink/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-white shadow-md">
                {tour.price}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {uniqueImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-all ${
                      activeImage === img ? 'ring-4 ring-cyan shadow-md scale-95' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ocean bg-ocean/10 px-3 py-1 rounded-full mb-3">
                <HiOutlineLocationMarker /> {tour.location}
              </span>
              <h1 className="text-4xl sm:text-5xl font-display text-ink leading-tight">{tour.title}</h1>
            </div>

            <div className="flex items-center gap-6 py-4 border-y border-ink/10">
              <div>
                <p className="text-xs uppercase font-bold text-ink/50 tracking-wider">Duration</p>
                <p className="text-base font-semibold text-ink flex items-center gap-1.5 mt-1">
                  <HiOutlineClock className="text-cyan" /> {tour.duration}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-ink/50 tracking-wider">Starting Price</p>
                <p className="text-xl font-display text-ocean font-bold mt-1">{tour.price}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase font-bold text-ink/50 tracking-wider mb-2">Overview</h3>
              <p className="text-ink/75 leading-relaxed text-base">{tour.description}</p>
            </div>

            {/* Included Experience summary card */}
            <div className="bg-white/80 rounded-2xl p-6 border border-ink/5 space-y-3 shadow-xs">
              <h4 className="font-bold text-ink text-sm flex items-center gap-2">
                <HiOutlineSparkles className="text-cyan" /> Included Experience
              </h4>
              <ul className="text-xs text-ink/70 space-y-2">
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-ocean" /> Tailored luxury accommodation & daily breakfast
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-ocean" /> Private transfers and curated local sight-seeing
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-ocean" /> 24/7 dedicated Desi Journey concierge support
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-4">
              <button
                onClick={() => navigate('/contact', { state: { tourTitle: tour.title } })}
                className="gold-button flex-1 py-4 text-center text-base shadow-lg hover:shadow-xl"
              >
                Inquire & Book Now
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: DAY WISE ITINERARY */}
        {tour.itinerary && tour.itinerary.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink flex items-center gap-2">
              <HiOutlineCalendar className="text-cyan" /> Itinerary
            </h2>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-ink/5 divide-y divide-slate-100">
              {tour.itinerary.map((item, idx) => {
                const dayNum = item.day || idx + 1;
                const isOpen = openDay === dayNum;

                return (
                  <div key={idx} className="transition-colors">
                    {/* Accordion Header Bar */}
                    <button
                      onClick={() => toggleDay(dayNum)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-full flex-shrink-0">
                          Day {dayNum}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base tracking-wide">
                          {item.title}
                        </h3>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold ml-4 flex-shrink-0">
                        {isOpen ? <HiMinus size={16} /> : <HiPlus size={16} />}
                      </div>
                    </button>

                    {/* Accordion Content Body */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                              {item.image && (
                                <div className="sm:col-span-4 h-48 sm:h-36 rounded-2xl overflow-hidden shadow-xs">
                                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                              )}

                              <div className={`${item.image ? 'sm:col-span-8' : 'sm:col-span-12'} space-y-3`}>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                                  {item.description}
                                </p>

                                {item.meals && (
                                  <p className="text-xs font-semibold text-slate-700">
                                    <span className="text-slate-400">Meals:</span> {item.meals}
                                  </p>
                                )}

                                {item.extras && (
                                  <p className="text-xs font-semibold text-ocean">
                                    <span className="text-slate-400">Extra Toppings:</span> {item.extras}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: INCLUSIONS & EXCLUSIONS */}
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-wider">
            INCLUSIONS & EXCLUSIONS
          </h2>

          <div className="bg-[#f2f7fc] rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Inclusions */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  INCLUSIONS :
                </h3>
                <ul className="space-y-3">
                  {(tour.inclusions && tour.inclusions.length > 0 ? tour.inclusions : [
                    "All accommodation is Super deluxe/premium category",
                    "Twin share (MAP)",
                    "Transportation by Tempo Traveller",
                    "Sightseeing",
                    "Inner Line Permit",
                    "Oxygen cylinder and First aid kit",
                    "Pick up and Drop"
                  ]).map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-800 font-medium leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                        <HiOutlineCheckCircle size={16} />
                      </span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Exclusions */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  EXCLUSIONS :
                </h3>
                <ul className="space-y-3">
                  {(tour.exclusions && tour.exclusions.length > 0 ? tour.exclusions : [
                    "Any kind of Bottle water",
                    "Entry fees of any place of interest",
                    "Any food other than mentioned in Itinerary",
                    "Anything not specifically mentioned in Itinerary",
                    "Family Expenses"
                  ]).map((exc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-medium leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 border border-red-200">
                        <HiOutlineXCircle size={16} />
                      </span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>

                {/* Terms / Refund Policy Subsection */}
                <div className="pt-6 border-t border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <HiOutlineShieldCheck className="text-ocean" /> Cancellation and Refund Policy:
                  </h4>
                  <div className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                    {tour.terms || "Due to peak season advance payment non refundable."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
