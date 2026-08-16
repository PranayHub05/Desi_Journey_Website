import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAchievements } from '../hooks/useAchievements';
import { deleteAchievement } from '../services/api';
import { 
  HiOutlineBadgeCheck, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiOutlineEye, 
  HiSearch 
} from 'react-icons/hi';

export default function AdminAchievementsPage() {
  const { achievements, loading, refetch } = useAchievements();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement certificate?')) {
      await deleteAchievement(id);
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading achievements collection...</p>
      </div>
    );
  }

  const filteredItems = achievements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.issuer && a.issuer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan/10 text-cyan text-xs font-bold uppercase tracking-wider rounded-full mb-2">
            <HiOutlineBadgeCheck /> Certificates Manager
          </span>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Achievements & Certificates ({achievements.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">Manage official recognition badges, ISO/GST certificates, and industry awards.</p>
        </div>

        <Link 
          to="/admin/achievements/new" 
          className="gold-button self-start sm:self-auto py-3 px-5 text-xs flex items-center gap-2"
        >
          <HiPlus size={16} /> Add New Certificate / Award
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
              placeholder="Search by certificate title or issuer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
            />
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>

          <p className="text-xs font-semibold text-slate-400">
            Showing {filteredItems.length} of {achievements.length} items
          </p>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemId = item.id || item._id;
            return (
              <div 
                key={itemId} 
                className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-200 relative border border-slate-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-white/90 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {item.category || 'Certificate'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                    <span>{item.issuer || 'Official Issuer'}</span>
                    {item.year && <span>{item.year}</span>}
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-lg line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <Link 
                    to="/achievements" 
                    target="_blank"
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                  >
                    <HiOutlineEye size={14} /> Preview Live
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/admin/achievements/${itemId}`} 
                      className="px-3 py-1.5 bg-cyan/10 text-cyan font-bold text-xs rounded-xl hover:bg-cyan hover:text-white transition flex items-center gap-1"
                    >
                      <HiPencil size={14} /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(itemId)} 
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

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            No achievement certificates matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
}
