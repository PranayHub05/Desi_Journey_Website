import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBadgeCheck, HiX, HiOutlineEye, HiOutlineAcademicCap } from 'react-icons/hi';
import { useAchievements } from '../hooks/useAchievements';
import SectionHeading from '../components/SectionHeading';
import LoadingScreen from '../components/LoadingScreen';

export default function AchievementsPage() {
  const { achievements, loading, error } = useAchievements();
  const [activeItem, setActiveItem] = useState(null);
  const [filter, setFilter] = useState('All');

  if (loading) return <LoadingScreen />;

  const categories = ['All', 'Certificates', 'Accolades', 'Recognitions'];

  const filteredItems = filter === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === filter);

  return (
    <div id="achievements" className="min-h-screen bg-sand pt-32 pb-24">
      {/* Hero Header */}
      <section className="bg-ink py-16 text-center text-white mb-12 relative overflow-hidden">
        <div className="container-luxe relative z-10">
          <p className="eyebrow justify-center !text-cyan mb-3 flex items-center gap-1.5">
            <HiOutlineBadgeCheck /> Trust & Accreditation
          </p>
          <h1 className="display-font text-4xl sm:text-6xl text-white font-bold">
            Achievements & Certificates
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65">
            Verified certifications, industry recognitions, and awards honoring our commitment to exceptional travel standards.
          </p>
        </div>
      </section>

      <div className="container-luxe space-y-10">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                filter === cat
                  ? 'bg-cyan text-ink shadow-md scale-105'
                  : 'bg-white text-ink/70 hover:bg-white/80 border border-ink/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center text-red-500 py-10">
            Failed to load achievements.
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            const itemId = item.id || item._id;
            return (
              <motion.div
                key={itemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setActiveItem(item)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm border border-ink/5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Preview Container */}
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-ink shadow-md flex items-center gap-1.5">
                        <HiOutlineEye size={16} /> View Certificate
                      </span>
                    </div>

                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-ink text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                      {item.category || 'Certificate'}
                    </span>

                    {item.year && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-ink/80 text-white text-[10px] font-bold rounded-full backdrop-blur-md">
                        {item.year}
                      </span>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-6 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-cyan">
                      {item.issuer || 'Official Recognition'}
                    </p>
                    <h3 className="font-display font-bold text-xl text-ink leading-tight group-hover:text-ocean transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-ink/65 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <span className="text-xs font-bold text-ocean group-hover:text-cyan transition flex items-center gap-1">
                    Expand Details & Certificate →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-ink/40 text-sm">
            No achievements found in this category.
          </div>
        )}
      </div>

      {/* Fullscreen Certificate Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 text-ink/60 hover:text-ink bg-white/90 hover:bg-white rounded-full transition shadow-md z-10"
              >
                <HiX size={20} />
              </button>

              <div className="max-h-[60vh] bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-contain max-h-[55vh]"
                />
              </div>

              <div className="p-8 space-y-3 text-left bg-white">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-cyan/15 text-ocean text-xs font-bold uppercase tracking-wider rounded-full">
                    {activeItem.category} • {activeItem.year}
                  </span>
                  <span className="text-xs font-semibold text-ink/50">{activeItem.issuer}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display text-ink font-bold">{activeItem.title}</h2>
                <p className="text-ink/70 text-sm leading-relaxed">{activeItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
