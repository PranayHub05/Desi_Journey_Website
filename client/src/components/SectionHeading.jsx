import { motion } from 'framer-motion'
export default function SectionHeading({ eyebrow, title, text, center = false, light = false }) {
  return <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .25 }} transition={{ duration: .65 }} className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
    <p className={`eyebrow ${center ? 'justify-center' : ''} ${light ? '!text-cyan' : ''}`}>{eyebrow}</p>
    <h2 className={`display-font text-4xl leading-[1.08] sm:text-5xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
    {text && <p className={`mt-5 text-base leading-7 ${light ? 'text-white/70' : 'text-ink/65'}`}>{text}</p>}
  </motion.div>
}
