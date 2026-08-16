import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineArrowNarrowDown } from 'react-icons/hi'
import AITravelSearch from './AITravelSearch'

const phrases = ['Dream Destination', 'Perfect Holiday', 'Weekend Escape', 'Adventure', 'Mountain Retreat', 'Beach Paradise', 'Family Vacation', 'Luxury Escape', 'Romantic Getaway', 'Hidden Gem', 'International Adventure', 'Next Journey']

function useTypewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0); const [text, setText] = useState(''); const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const target = phrases[phraseIndex]
    const done = !deleting && text === target, cleared = deleting && text === ''
    const delay = done ? 1500 : cleared ? 260 : deleting ? 38 : 78
    const id = setTimeout(() => {
      if (done) return setDeleting(true)
      if (cleared) { setDeleting(false); return setPhraseIndex((i) => (i + 1) % phrases.length) }
      setText(target.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => clearTimeout(id)
  }, [text, deleting, phraseIndex])
  return text
}

export default function Hero() {
  const typed = useTypewriter()
  const scroll = () => document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })
  return <section id="home" className="relative flex min-h-[780px] items-center overflow-hidden bg-ink pt-16 text-white sm:min-h-screen">
    <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1800&q=85" className="absolute inset-0 size-full object-cover" aria-hidden="true"><source src="https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4" type="video/mp4" /></video>
    <div className="video-overlay absolute inset-0" /><div className="hero-mesh absolute inset-0" />
    <span className="float-slow absolute left-[8%] top-[27%] size-2 rounded-full bg-cyan/70 blur-[1px]" /><span className="float-slow absolute right-[13%] top-[35%] size-3 rounded-full bg-white/50 blur-[1px]" />
    <div className="container-luxe relative z-10 py-24 text-center"><motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .15 }} className="mx-auto mb-5 flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-cyan backdrop-blur-md"><span className="size-1.5 rounded-full bg-cyan shadow-[0_0_15px_#12b4ea]" /> Bespoke experiences, beautifully planned</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .9, delay: .25 }} className="display-font mx-auto max-w-5xl text-5xl leading-[.99] sm:text-7xl lg:text-[5.8rem]"><span className="block font-medium text-white/92">Discover your</span><span className="mt-2 block min-h-[1.12em] bg-gradient-to-r from-[#d7f8ff] via-cyan to-[#9ce3ff] bg-clip-text italic text-transparent">{typed}<i className="cursor" /></span></motion.h1>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .55 }} className="mt-8"><AITravelSearch /></motion.div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }} onClick={scroll} className="gold-button mt-7">Explore destinations <HiOutlineArrowNarrowDown /></motion.button>
    </div>
    <button onClick={scroll} aria-label="Scroll to featured journeys" className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/70 transition hover:text-white"><span className="mb-2 block text-[9px] font-bold uppercase tracking-[.25em]">Scroll to wander</span><HiOutlineArrowNarrowDown className="mx-auto animate-bounce text-xl" /></button>
  </section>
}
