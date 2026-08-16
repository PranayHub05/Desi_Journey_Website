import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import SectionHeading from './SectionHeading';
import { usePosts } from '../hooks/usePosts';

export default function BlogPreview({ all = false }) { 
  const { posts, loading, error } = usePosts();

  if (loading) {
    return <div className="text-center py-20 text-ink/60 font-bold text-sm animate-pulse">Loading journal...</div>;
  }

  const safePosts = Array.isArray(posts) ? posts : [];
  const displayedPosts = all ? safePosts : safePosts.slice(0, 3);

  return (
    <section id="blog" className="section-space bg-sand">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading 
            eyebrow="The journal" 
            title="Travel, in a better light." 
            text="Thoughtful notes for the way you want to move through the world." 
          />
          {!all && (
            <Link to="/blog" className="mb-1 inline-flex items-center gap-2 text-sm font-bold text-ocean hover:text-ink">
              Read the journal <HiOutlineArrowNarrowRight />
            </Link>
          )}
        </div>
        
        {error ? (
          <div className="mt-12 text-center text-red-500 font-medium">Failed to load journal posts.</div>
        ) : displayedPosts.length === 0 ? (
          <div className="mt-12 text-center py-8 text-ink/50 text-sm">No journal articles available.</div>
        ) : (
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {displayedPosts.map((post, i) => {
              const postId = post.id || post._id;
              return (
                <motion.article 
                  initial={{ opacity: 0, y: 24 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * .08 }} 
                  key={postId || post.title} 
                  className="group flex flex-col justify-between bg-white rounded-[1.6rem] p-5 shadow-sm border border-ink/5 hover:shadow-md transition"
                >
                  <div>
                    <Link to={`/blog/${postId}`} className="block h-56 overflow-hidden rounded-[1.2rem] mb-4">
                      <img src={post.image} alt={post.title} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
                    </Link>
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-ocean">{post.category}</p>
                    <Link to={`/blog/${postId}`}>
                      <h3 className="display-font mt-2 text-2xl leading-tight text-ink hover:text-ocean transition">{post.title}</h3>
                    </Link>
                    <p className="mt-3 text-sm leading-6 text-ink/60 line-clamp-3">{post.excerpt}</p>
                  </div>
                  <Link to={`/blog/${postId}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink transition hover:gap-3">
                    Read article <HiOutlineArrowNarrowRight className="text-cyan" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
