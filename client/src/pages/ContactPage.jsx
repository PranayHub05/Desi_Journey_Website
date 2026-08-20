import ContactPreview from '../components/ContactPreview'
import { SEO, getBreadcrumbSchema } from '../seo'

export default function ContactPage() { 
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact & Plan', path: '/contact' }
  ];

  return (
    <>
      <SEO 
        title="Contact & Plan Your Custom Holiday"
        description="Connect with Desi Journey travel concierges via WhatsApp or email to plan your tailored holiday in Andaman, Kashmir, Bali, or bespoke destinations."
        canonical="/contact"
        keywords={['contact desi journey', 'plan custom trip india', 'luxury travel agent whatsapp', 'book andaman holiday']}
        schema={getBreadcrumbSchema(breadcrumbs)}
      />

      <section className="bg-ink pt-36 text-center text-white">
        <div className="container-luxe pb-20">
          <p className="eyebrow justify-center !text-cyan">Your next chapter</p>
          <h1 className="display-font text-5xl sm:text-7xl">Let’s make it real.</h1>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/65">
            No pressure, no confusing packages. Just tell us what a wonderful trip looks like to you.
          </p>
        </div>
      </section>
      <ContactPreview compact />
    </>
  )
}
