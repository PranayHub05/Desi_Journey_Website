import BlogPreview from '../components/BlogPreview'
import { SEO, getBreadcrumbSchema } from '../seo'

export default function BlogPage() { 
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Journal & Guides', path: '/blog' }
  ];

  return (
    <>
      <SEO 
        title="The Desi Journal | Travel Guides & Stories"
        description="Read insightful travel stories, offbeat destination guides, and slow travel essays from the curators at Desi Journey."
        canonical="/blog"
        keywords={['travel blog india', 'slow travel guides', 'offbeat destinations india', 'desi journey travel journal']}
        schema={getBreadcrumbSchema(breadcrumbs)}
      />

      <section className="bg-ink pt-36 pb-20 text-center text-white">
        <div className="container-luxe">
          <p className="eyebrow justify-center !text-cyan">The Desi Journal</p>
          <h1 className="display-font text-5xl sm:text-7xl">Travel, considered.</h1>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/65">
            Notes, guides, and a different way of looking at the places on your list.
          </p>
        </div>
      </section>
      <BlogPreview all />
    </>
  )
}
