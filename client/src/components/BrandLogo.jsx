import logo from '../assets/desi-journey-logo.jpg'

export default function BrandLogo({ light = false, compact = false }) {
  return (
    <div className="flex items-center gap-3 select-none" aria-label="Desi Journey home">
      <img
        src={logo}
        alt="Desi Journey"
        className={`rounded-xl object-cover shadow-sm ring-1 ring-white/20 transition-transform duration-300 hover:scale-105 ${
          compact ? 'h-9 w-9' : 'h-11 w-11'
        }`}
      />
      <span className={`font-display font-bold tracking-tight ${compact ? 'text-xl' : 'text-2xl'}`}>
        <span className={light ? 'text-white' : 'text-ink'}>Desi </span>
        <span className="text-cyan">Journey</span>
      </span>
    </div>
  )
}
