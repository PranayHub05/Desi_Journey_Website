import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineMenuAlt3, HiX, HiOutlineMap, HiOutlineSparkles, HiOutlinePhone } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import BrandLogo from './BrandLogo'

const navItems = [
  ['Home', 'home', '/'],
  ['Trips', 'trips', '/destinations'],
  ['About', 'about', '/#about'],
  ['Achievements', 'achievements', '/achievements'],
  ['Gallery', 'gallery', '/#gallery'],
  ['Journal', 'blog', '/#blog'],
  ['Contact', 'contact', '/#contact'],
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 36)
    listener()
    window.addEventListener('scroll', listener)
    return () => window.removeEventListener('scroll', listener)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const goTo = (item) => { 
    setOpen(false)
    const [label, section, route] = item
    if (section === 'home') navigate('/')
    else if (section === 'trips') navigate('/destinations')
    else if (section === 'achievements') navigate('/achievements')
    else if (route.startsWith('/#')) {
      if (pathname !== '/') {
        navigate(route)
      } else {
        const target = document.querySelector(route.replace('/', ''))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        } else {
          navigate(route)
        }
      }
    } else {
      navigate(route)
    }
  }

  const isActive = (item) => {
    const [, section, route] = item
    if (section === 'home') return pathname === '/' && !hash
    if (section === 'trips') return pathname === '/destinations'
    if (section === 'achievements') return pathname === '/achievements'
    return hash === `#${section}`
  }

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled || pathname !== '/' ? 'nav-glass py-3' : 'py-5'}`}>
        <div className="container-luxe flex items-center justify-between">
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <button 
                key={item[1]} 
                onClick={() => goTo(item)} 
                className={`relative text-xs font-semibold uppercase tracking-[.12em] transition ${
                  isActive(item) ? 'text-cyan' : 'text-white/85 hover:text-white'
                }`}
              >
                {item[0]}
                {isActive(item) && (
                  <motion.span layoutId="activeNav" className="absolute -bottom-2 left-0 h-px w-full bg-cyan" />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button 
            className="lg:hidden flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors border border-white/15" 
            aria-label="Open navigation menu" 
            onClick={() => setOpen(true)}
          >
            <HiOutlineMenuAlt3 />
          </button>

          {/* Logo on Right */}
          <Link to="/" className="ml-auto" aria-label="Desi Journey home">
            <BrandLogo light />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }} 
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-[#050f24] text-white flex flex-col justify-between overflow-y-auto lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Top Bar with Brand Logo & Prominent Close Button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#071533]">
              <Link to="/" onClick={() => setOpen(false)}>
                <BrandLogo light compact />
              </Link>
              
              <button 
                onClick={() => setOpen(false)} 
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 rounded-full text-white text-xs font-bold transition shadow-sm"
                aria-label="Close navigation"
              >
                <HiX size={18} />
                <span>Close</span>
              </button>
            </div>

            {/* Middle Nav Links */}
            <nav className="flex flex-col px-6 py-8 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-cyan mb-2">Navigation Menu</p>
              {navItems.map((item) => {
                const active = isActive(item)
                return (
                  <button 
                    key={item[1]} 
                    onClick={() => goTo(item)} 
                    className={`flex items-center justify-between w-full text-left px-4 py-3.5 rounded-2xl text-xl font-display font-medium transition-all ${
                      active 
                        ? 'bg-cyan/15 text-cyan border border-cyan/30 font-bold' 
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item[0]}</span>
                    {item[1] === 'trips' && (
                      <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-cyan/20 text-cyan flex items-center gap-1">
                        <HiOutlineSparkles size={12} /> Explore
                      </span>
                    )}
                    {item[1] === 'achievements' && (
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                        Accreditations
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Bottom Actions Bar */}
            <div className="p-6 border-t border-white/10 bg-[#040c1d] space-y-3">
              <button
                onClick={() => {
                  setOpen(false)
                  navigate('/destinations')
                }}
                className="w-full gold-button py-3.5 text-xs text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <HiOutlineMap size={16} /> Explore All Trips
              </button>

              <a 
                href="https://wa.me/919748424597" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-xs font-bold transition"
              >
                <FaWhatsapp size={16} /> Chat on WhatsApp (+91 97484 24597)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
