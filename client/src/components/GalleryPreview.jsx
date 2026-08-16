import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import SectionHeading from './SectionHeading';
import { galleryImages } from '../data/content';
import { useTours } from '../hooks/useTours';

export default function GalleryPreview({ limit = 6 }) { 
  const [active, setActive] = useState(null);
  const { tours } = useTours();
  
  const items = useMemo(() => {
    const safeTours = Array.isArray(tours) ? tours : [];
    const tourImages = safeTours
      .filter(t => t && t.images && Array.isArray(t.images) && t.images.length > 0)
      .flatMap(t => t.images.map(img => ({ src: img, alt: t.title })));
    
    // Combine and deduplicate
    const combined = [...galleryImages, ...tourImages];
    const unique = Array.from(new Map(combined.map(item => [item.src, item])).values());
    
    return unique.slice(0, limit);
  }, [tours, limit]);

  useEffect(() => { 
    const close = (e) => e.key === 'Escape' && setActive(null); 
    window.addEventListener('keydown', close); 
    return () => window.removeEventListener('keydown', close); 
  }, []); 

  return (
    <section id="gallery" className="section-space bg-white">
      <div className="container-luxe">
        <SectionHeading 
          center 
          eyebrow="Postcards from the road" 
          title="A little of the world, held close." 
          text="Each frame is a reminder that the best plans always leave space for serendipity." 
        />
        <div className="masonry mt-12">
          {items.map((item, i) => (
            <motion.button 
              initial={{ opacity: 0, scale: .96 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * .06 }} 
              key={item.src} 
              onClick={() => setActive(item)} 
              className="group relative block w-full overflow-hidden rounded-2xl text-left focus:outline-none focus:ring-4 focus:ring-cyan/40"
            >
              <img 
                src={item.src} 
                alt={item.alt} 
                loading="lazy" 
                className={`w-full object-cover transition duration-700 group-hover:scale-110 ${i % 3 === 1 ? 'h-72 sm:h-96' : 'h-56 sm:h-72'}`} 
              />
              <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/25" />
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            role="dialog" 
            aria-modal="true" 
            aria-label="Gallery image preview" 
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/90 p-5 backdrop-blur-sm" 
            onClick={() => setActive(null)}
          >
            <button className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white" aria-label="Close preview">
              <HiX />
            </button>
            <motion.img 
              initial={{ scale: .94 }} 
              animate={{ scale: 1 }} 
              onClick={(e) => e.stopPropagation()} 
              src={active.src} 
              alt={active.alt} 
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
