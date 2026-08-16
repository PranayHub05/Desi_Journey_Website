import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { deletePost } from '../services/api';
import { 
  HiOutlineDocumentText, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiOutlineEye, 
  HiSearch,
  HiOutlineTag
} from 'react-icons/hi';

export default function AdminPostsPage() {
  const { posts, loading, refetch } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal article?')) {
      await deletePost(id);
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading journal collection...</p>
      </div>
    );
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ocean/10 text-ocean text-xs font-bold uppercase tracking-wider rounded-full mb-2">
            <HiOutlineDocumentText /> Dedicated Journal Manager
          </span>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Journal Articles ({posts.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">Publish, edit, or categorize your travel articles & search keywords.</p>
        </div>

        <Link 
          to="/admin/posts/new" 
          className="gold-button self-start sm:self-auto py-3 px-5 text-xs flex items-center gap-2"
        >
          <HiPlus size={16} /> Write Journal Article
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by article title or category..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
            />
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>

          <p className="text-xs font-semibold text-slate-400">
            Showing {filteredPosts.length} of {posts.length} articles
          </p>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const postId = post.id || post._id;
            return (
              <div 
                key={postId} 
                className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-200">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-cyan/15 text-cyan text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {post.category}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 text-lg line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{post.excerpt}</p>
                </div>

                {/* Keywords tags summary */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1">
                    {post.keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="text-[10px] text-slate-400 font-medium">#{kw}</span>
                    ))}
                    {post.keywords.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-bold">+{post.keywords.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <Link 
                    to={`/blog/${postId}`} 
                    target="_blank"
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                  >
                    <HiOutlineEye size={14} /> Preview
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/admin/posts/${postId}`} 
                      className="px-3 py-1.5 bg-cyan/10 text-cyan font-bold text-xs rounded-xl hover:bg-cyan hover:text-white transition flex items-center gap-1"
                    >
                      <HiPencil size={14} /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(postId)} 
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Delete Entry"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            No journal entries matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
}
