import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTours } from '../hooks/useTours';
import { usePosts } from '../hooks/usePosts';
import { fetchPopups, deleteTour, deletePost } from '../services/api';
import { 
  HiOutlineMap, 
  HiOutlineDocumentText, 
  HiOutlineChatAlt2, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiOutlineEye,
  HiOutlineSparkles,
  HiSearch,
  HiStar
} from 'react-icons/hi';

export default function AdminDashboard() {
  const { tours, loading: toursLoading, refetch: refetchTours } = useTours();
  const { posts, loading: postsLoading, refetch: refetchPosts } = usePosts();
  const [popups, setPopups] = useState([]);
  const [popupsLoading, setPopupsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tours'); // 'tours' | 'posts' | 'popups'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPopups()
      .then(setPopups)
      .catch(console.error)
      .finally(() => setPopupsLoading(false));
  }, []);

  const handleDeleteTour = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      await deleteTour(id);
      refetchTours();
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      refetchPosts();
    }
  };

  if (toursLoading || postsLoading || popupsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Loading admin workspace...</p>
      </div>
    );
  }

  const activePopupsCount = popups.filter(p => p.active).length;

  const filteredTours = tours.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#081325] via-[#0d213f] to-[#122e57] text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            <HiOutlineSparkles /> Control Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
            Welcome Back, Admin 👋
          </h1>
          <p className="text-white/70 text-sm mt-2 leading-relaxed">
            Manage custom itineraries, publish journal entries, and configure visitor promotional announcements in real-time.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Link 
              to="/admin/tours/new" 
              className="px-4 py-2.5 bg-gradient-to-r from-cyan to-ocean text-white font-bold text-xs rounded-xl shadow-md hover:shadow-cyan/20 transition flex items-center gap-1.5"
            >
              <HiPlus size={16} /> Add New Tour
            </Link>
            <Link 
              to="/admin/posts/new" 
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <HiPlus size={16} /> Write Journal Entry
            </Link>
            <Link 
              to="/admin/popups" 
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <HiPlus size={16} /> New Popup Alert
            </Link>
          </div>
        </div>

        {/* Ambient shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tours</p>
            <p className="text-3xl font-display font-bold text-slate-900 mt-1">{tours.length}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Live in collection</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan/15 text-cyan flex items-center justify-center">
            <HiOutlineMap size={28} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Journal Posts</p>
            <p className="text-3xl font-display font-bold text-slate-900 mt-1">{posts.length}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Published guides</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-ocean/15 text-ocean flex items-center justify-center">
            <HiOutlineDocumentText size={28} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Popups</p>
            <p className="text-3xl font-display font-bold text-slate-900 mt-1">{activePopupsCount}</p>
            <p className="text-xs text-amber-600 font-semibold mt-1">{popups.length} total created</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <HiOutlineChatAlt2 size={28} />
          </div>
        </div>
      </div>

      {/* Main Content Area with Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        {/* Navigation & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl self-start">
            <button
              onClick={() => setActiveTab('tours')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'tours' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tours ({tours.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'posts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Journal Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('popups')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'popups' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Popups ({popups.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title or location..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/15"
            />
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>
        </div>

        {/* TAB 1: TOURS LIST */}
        {activeTab === 'tours' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Tours & Destinations Collection</h3>
              <Link to="/admin/tours/new" className="gold-button text-xs py-2.5 px-4 flex items-center gap-1">
                <HiPlus /> Add Tour
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Tour</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredTours.map((tour) => {
                    const tourId = tour.id || tour._id;
                    return (
                      <tr key={tourId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img src={tour.image} alt={tour.title} className="w-12 h-12 rounded-xl object-cover shadow-xs" />
                            <div>
                              <p className="font-bold text-slate-900">{tour.title}</p>
                              <p className="text-xs text-slate-400 line-clamp-1">{tour.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-700">{tour.location}</td>
                        <td className="py-4 px-4 text-slate-600 text-xs">{tour.duration}</td>
                        <td className="py-4 px-4 font-bold text-ocean">{tour.price}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200/60">
                            <HiStar className="text-amber-500" /> {tour.rating}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/tours/${tourId}`} target="_blank" className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg transition" title="Preview Live">
                              <HiOutlineEye size={16} />
                            </Link>
                            <Link to={`/admin/tours/${tourId}`} className="p-2 text-cyan hover:text-ocean bg-cyan/10 rounded-lg transition" title="Edit Tour">
                              <HiPencil size={16} />
                            </Link>
                            <button onClick={() => handleDeleteTour(tourId)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg transition" title="Delete Tour">
                              <HiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredTours.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">No tours matching search term.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: POSTS LIST */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Journal Articles</h3>
              <Link to="/admin/posts/new" className="gold-button text-xs py-2.5 px-4 flex items-center gap-1">
                <HiPlus /> Write Entry
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Excerpt</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredPosts.map((post) => {
                    const postId = post.id || post._id;
                    return (
                      <tr key={postId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img src={post.image} alt={post.title} className="w-12 h-12 rounded-xl object-cover shadow-xs" />
                            <p className="font-bold text-slate-900 line-clamp-1">{post.title}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-cyan/10 text-cyan text-xs font-bold rounded-full">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-xs max-w-md line-clamp-2">{post.excerpt}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/blog/${postId}`} target="_blank" className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg transition" title="Preview Live">
                              <HiOutlineEye size={16} />
                            </Link>
                            <Link to={`/admin/posts/${postId}`} className="p-2 text-cyan hover:text-ocean bg-cyan/10 rounded-lg transition" title="Edit Post">
                              <HiPencil size={16} />
                            </Link>
                            <button onClick={() => handleDeletePost(postId)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg transition" title="Delete Post">
                              <HiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">No journal articles matching search term.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: POPUPS LIST */}
        {activeTab === 'popups' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Visitor Announcement Popups</h3>
              <Link to="/admin/popups" className="gold-button text-xs py-2.5 px-4 flex items-center gap-1">
                <HiPlus /> Manage Popups
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popups.map((popup) => {
                const popupId = popup.id || popup._id;
                return (
                  <div key={popupId} className={`p-6 rounded-2xl border transition-all ${popup.active ? 'border-cyan bg-cyan/5' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900">{popup.title}</h4>
                      {popup.active ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">Disabled</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-4">{popup.message}</p>
                    <Link to="/admin/popups" className="text-xs font-bold text-cyan hover:underline">
                      Edit in Popup Manager →
                    </Link>
                  </div>
                );
              })}
              {popups.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-400 text-sm">No popups configured yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
