import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineArrowNarrowRight, HiOutlineClock, HiOutlineLocationMarker, HiStar } from 'react-icons/hi'

export default function TourCard({ tour, index = 0 }) {
  const tourId = tour.id || tour._id;
  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: .15 }} 
      transition={{ duration: .55, delay: index * .07 }} 
      whileHover={{ y: -10 }} 
      className="group overflow-hidden rounded-[1.6rem] border border-white bg-white/75 shadow-[0_12px_35px_rgba(7,43,94,.08)] transition hover:shadow-glow flex flex-col"
    >
      <Link to={`/tours/${tourId}`} className="block relative h-60 overflow-hidden">
        <img src={tour.image} alt={`${tour.title}, ${tour.location}`} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink shadow-sm">
          <HiStar className="text-[#d49b3b]" /> {tour.rating}
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
          {tour.price}
        </span>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ocean">
          <HiOutlineLocationMarker /> {tour.location}
        </p>
        <Link to={`/tours/${tourId}`}>
          <h3 className="display-font text-2xl text-ink hover:text-ocean transition">{tour.title}</h3>
        </Link>
        <p className="mt-3 text-sm leading-6 text-ink/65 line-clamp-2 flex-1">{tour.description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-ink/8 pt-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink/60">
            <HiOutlineClock /> {tour.duration}
          </span>
          <Link to={`/tours/${tourId}`} className="group/btn inline-flex items-center gap-1 text-xs font-bold text-ocean" aria-label={`Explore ${tour.title}`}>
            Explore <HiOutlineArrowNarrowRight className="-rotate-45 transition group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
