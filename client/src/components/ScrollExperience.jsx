import { useEffect, useState } from 'react';
import { HiOutlineArrowUp } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ScrollExperience() { 
  const [progress, setProgress] = useState(0); 

  useEffect(() => { 
    const update = () => { 
      const height = document.documentElement.scrollHeight - window.innerHeight; 
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    }; 
    update(); 
    window.addEventListener('scroll', update, { passive: true }); 
    return () => window.removeEventListener('scroll', update);
  }, []); 

  return (
    <>
      <div 
        className="fixed left-0 top-0 z-[60] h-0.5 bg-gradient-to-r from-cyan to-ocean transition-all duration-150" 
        style={{ width: `${progress}%` }} 
      />
      <a 
        href="https://wa.me/919748424597" 
        target="_blank" 
        rel="noreferrer" 
        aria-label="Chat on WhatsApp" 
        className="fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full bg-[#25D366] text-xl text-white shadow-xl shadow-green-950/25 transition hover:-translate-y-1 hover:scale-105"
      >
        <FaWhatsapp />
      </a>
      {progress > 18 && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          aria-label="Back to top" 
          className="fixed bottom-[5.75rem] right-7 z-40 grid size-10 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-lg transition hover:-translate-y-1"
        >
          <HiOutlineArrowUp />
        </button>
      )}
    </>
  );
}
