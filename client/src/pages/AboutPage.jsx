import { Link } from 'react-router-dom';
import { HiOutlineArrowNarrowRight, HiOutlineBadgeCheck } from 'react-icons/hi';
import SectionHeading from '../components/SectionHeading';
import { SEO, getBreadcrumbSchema } from '../seo';

export default function AboutPage() { 
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' }
  ];

  return (
    <>
      <SEO 
        title="About Us & Our Philosophy"
        description="Learn about Desi Journey - bespoke travel curators offering accredited luxury and experiential journeys across India and global destinations."
        canonical="/about"
        keywords={['about desi journey', 'bespoke travel curators india', 'luxury travel company story']}
        schema={getBreadcrumbSchema(breadcrumbs)}
      />

      <section className="bg-ink pt-36 text-white">
        <div className="container-luxe grid gap-12 pb-24 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading 
              light 
              eyebrow="Our way of travelling" 
              title="The journey is never just the destination." 
              text="Desi Journey is for travellers who care about the details and leave with more than a camera roll. We turn scattered possibilities into journeys with feeling." 
            />
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link to="/#contact" className="gold-button">
                Plan with us <HiOutlineArrowNarrowRight />
              </Link>
              <Link to="/achievements" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-cyan font-bold text-sm rounded-full transition flex items-center gap-2 border border-cyan/30">
                <HiOutlineBadgeCheck size={18} /> View Accreditations & Certificates
              </Link>
            </div>
          </div>
          <img 
            className="h-[380px] w-full rounded-[2rem] object-cover shadow-2xl" 
            src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=85" 
            alt="A hiker on a tranquil mountain ridge" 
          />
        </div>
      </section>

      <section className="section-space bg-sand">
        <div className="container-luxe grid gap-10 md:grid-cols-3">
          <Value number="01" title="Listen first" text="The right itinerary begins with your energy, occasion, and non-negotiables—not a template." />
          <Value number="02" title="Know the places" text="We work with trusted local partners and firsthand perspective to plan with confidence." />
          <Value number="03" title="Leave room for magic" text="A great plan creates ease, while keeping a little open space for an unplanned yes." />
        </div>
      </section>
    </>
  );
}

function Value({ number, title, text }) { 
  return (
    <article className="rounded-3xl bg-white p-8 shadow-sm border border-ink/5">
      <span className="display-font text-4xl text-cyan">{number}</span>
      <h2 className="display-font mt-10 text-2xl text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-ink/65">{text}</p>
    </article>
  );
}
