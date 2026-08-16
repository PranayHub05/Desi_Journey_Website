import BlogPreview from '../components/BlogPreview'

export default function BlogPage() { 
  return (
    <>
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
