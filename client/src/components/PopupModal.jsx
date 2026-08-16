import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { fetchActivePopups } from '../services/api';

export default function PopupModal() {
  const [popup, setPopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('desi_journey_popup_seen');
    
    if (!hasSeenPopup) {
      fetchActivePopups()
        .then(activePopups => {
          if (activePopups && activePopups.length > 0) {
            setPopup(activePopups[0]);
            setTimeout(() => setIsVisible(true), 1200);
          }
        })
        .catch(console.error);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('desi_journey_popup_seen', 'true');
  };

  const handleCTA = () => {
    if (popup?.ctaLink) {
      window.location.href = popup.ctaLink;
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl text-center border border-white/30"
          >
            {/* Banner Image */}
            {popup.image && (
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img src={popup.image} alt={popup.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            )}

            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 text-ink/60 hover:text-ink bg-white/80 hover:bg-white rounded-full transition-colors z-20 shadow-sm"
              aria-label="Close Announcement"
            >
              <HiX size={20} />
            </button>

            <div className="p-8 sm:p-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-display text-ink leading-tight">{popup.title}</h2>
              <p className="text-ink/75 leading-relaxed text-sm sm:text-base">
                {popup.message}
              </p>

              {popup.ctaText && (
                <button 
                  onClick={handleCTA}
                  className="w-full gold-button py-4 text-base shadow-lg hover:shadow-xl transition-all mt-4"
                >
                  {popup.ctaText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
