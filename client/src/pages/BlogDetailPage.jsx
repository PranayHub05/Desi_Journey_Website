import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineArrowNarrowLeft, HiOutlineTag, HiOutlineBookmark } from 'react-icons/hi';
import { fetchPost } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost(id)
      .then(setPost)
      .catch((err) => setError(err.message || 'Failed to load article'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (error || !post) {
    return (
      <div className="min-h-screen bg-sand pt-36 pb-20 text-center container-luxe">
        <h2 className="text-3xl font-display text-ink mb-4">Article Not Found</h2>
        <p className="text-ink/60 mb-8">The journal entry you are looking for might have been moved or update.</p>
        <Link to="/blog" className="gold-button">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-sand pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-ocean hover:text-ink transition mb-8">
          <HiOutlineArrowNarrowLeft size={18} /> Back to Journal
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <span className="inline-block px-3 py-1 bg-cyan/15 text-ocean text-xs font-bold uppercase tracking-wider rounded-full">
            {post.category || 'Journal'}
          </span>
          <h1 className="text-4xl sm:text-6xl font-display text-ink leading-tight">{post.title}</h1>
          <p className="text-lg text-ink/70 leading-relaxed font-serif italic border-l-4 border-cyan pl-4 py-1">
            "{post.excerpt}"
          </p>
        </div>

        {/* Cover Image */}
        {post.image && (
          <div className="h-[360px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl mb-12 bg-ink/10">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-ink/5 space-y-6">
          <div className="prose prose-lg text-ink/80 leading-relaxed font-sans space-y-4">
            {post.content ? (
              post.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          {/* Keywords */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="pt-8 border-t border-ink/10">
              <h4 className="text-xs uppercase font-bold text-ink/40 tracking-wider mb-3 flex items-center gap-1.5">
                <HiOutlineTag /> Related Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-sand border border-ink/5 rounded-full text-xs font-medium text-ink/70">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footnote card */}
        <div className="mt-8 bg-ink text-white rounded-3xl p-8 flex items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-xl font-display mb-1 flex items-center gap-2">
              <HiOutlineBookmark className="text-cyan" /> Desi Journey Notes
            </h4>
            <p className="text-sm text-white/70">Curated travel stories and mindful itineraries crafted with love.</p>
          </div>
          <Link to="/destinations" className="gold-button flex-shrink-0 text-sm py-3 px-6">
            Explore Trips
          </Link>
        </div>
      </div>
    </article>
  );
}
