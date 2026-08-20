import Hero from '../components/Hero'
import FeaturedTrips from '../components/FeaturedTrips'
import Reviews from '../components/Reviews'
import AboutPreview from '../components/AboutPreview'
import GalleryPreview from '../components/GalleryPreview'
import BlogPreview from '../components/BlogPreview'
import ContactPreview from '../components/ContactPreview'
import { SEO, getTravelAgencySchema } from '../seo'

export default function HomePage() {
  return (
    <>
      <SEO 
        canonical="/"
        schema={getTravelAgencySchema()}
      />
      <Hero />
      <FeaturedTrips />
      <Reviews />
      <AboutPreview />
      <GalleryPreview />
      <BlogPreview />
      <ContactPreview />
    </>
  )
}
