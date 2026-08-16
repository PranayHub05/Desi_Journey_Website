import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'
import BrandLogo from './BrandLogo'

const navItems = [
  ['Home', 'home'], ['About', 'about'], ['Achievements', 'achievements'], ['Gallery', 'gallery'], ['Blog', 'blog'], ['Contact', 'contact'],
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  useEffect(() => { const listener = () => setScrolled(window.scrollY > 36); listener(); window.addEventListener('scroll', listener); return () => window.removeEventListener('scroll', listener) }, [])
  const goTo = (section) => { 
    setOpen(false); 
    if (section === 'home') navigate('/');
    else if (section === 'achievements') navigate('/achievements');
    else navigate(`/#${section}`); 
  }
  const isActive = (section) => {
    if (section === 'home') return pathname === '/' && !hash;
    if (section === 'achievements') return pathname === '/achievements';
    return hash === `#${section}`;
  }

  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || pathname !== '/' ? 'nav-glass py-3' : 'py-5'}`}>
    <div className="container-luxe flex items-center justify-between">
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
        {navItems.map(([label, section]) => <button key={section} onClick={() => goTo(section)} className={`relative text-xs font-semibold uppercase tracking-[.12em] transition ${isActive(section) ? 'text-cyan' : 'text-white/85 hover:text-white'}`}>
          {label}{isActive(section) && <motion.span layoutId="activeNav" className="absolute -bottom-2 left-0 h-px w-full bg-cyan" />}
        </button>)}
        <Link to="/destinations" className={`text-xs font-semibold uppercase tracking-[.12em] ${pathname === '/destinations' ? 'text-cyan' : 'text-white/85 hover:text-white'}`}>Trips</Link>
      </nav>
      <button className="lg:hidden text-2xl text-white" aria-label="Open navigation" onClick={() => setOpen(true)}><HiOutlineMenuAlt3 /></button>
      <Link to="/" className="ml-auto" aria-label="Desi Journey home"><BrandLogo light /></Link>
    </div>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 grid place-items-center bg-ink/95 backdrop-blur-xl lg:hidden">
      <button onClick={() => setOpen(false)} className="absolute right-6 top-6 text-3xl text-white" aria-label="Close navigation"><HiX /></button>
      <nav className="flex flex-col items-center gap-7" aria-label="Mobile navigation">
        {navItems.map(([label, section]) => <button key={section} onClick={() => goTo(section)} className="display-font text-3xl text-white transition hover:text-cyan">{label}</button>)}
        <Link onClick={() => setOpen(false)} to="/destinations" className="display-font text-3xl text-white hover:text-cyan">Trips</Link>
      </nav>
    </motion.div>}</AnimatePresence>
  </header>
}
