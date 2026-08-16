import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTours } from '../hooks/useTours';
import { deleteTour } from '../services/api';
import { 
  HiOutlineMap, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiOutlineEye, 
  HiSearch, 
  HiStar,
  HiOutlineLocationMarker,
  HiOutlineClock
} from 'react-icons/hi';

export default function AdminToursPage() {
  const { tours, loading, refetch } = useTours();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour package?')) {
      await deleteTour(id);
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading tours collection...</p>
      </div>
    );
  }

  const filteredTours = tours.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan/10 text-cyan text-xs font-bold uppercase tracking-wider rounded-full mb-2">
            <HiOutlineMap /> Dedicated Tour Manager
          </span>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Tours & Trips Collection ({tours.length})
          </h1>
          <p className="text-slate-500 text-xs mt-1">Manage itineraries, prices, gallery photos, and search keywords.</p>
        </div>

        <Link 
          to="/admin/tours/new" 
          className="gold-button self-start sm:self-auto py-3 px-5 text-xs flex items-center gap-2"
        >
          <HiPlus size={16} /> Add New Tour Package
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
              placeholder="Search by tour title or location..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
            />
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>

          <p className="text-xs font-semibold text-slate-400">
            Showing {filteredTours.length} of {tours.length} packages
          </p>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Tour Package</th>
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
                      <div className="flex items-center gap-3.5">
                        <img src={tour.image} alt={tour.title} className="w-14 h-14 rounded-2xl object-cover shadow-xs border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{tour.title}</p>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-xs">{tour.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <HiOutlineLocationMarker className="text-cyan" /> {tour.location}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="text-slate-400" /> {tour.duration}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-ocean">{tour.price}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200/60">
                        <HiStar className="text-amber-500" /> {tour.rating}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/tours/${tourId}`} 
                          target="_blank" 
                          className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-xl transition" 
                          title="Preview Live"
                        >
                          <HiOutlineEye size={16} />
                        </Link>
                        <Link 
                          to={`/admin/tours/${tourId}`} 
                          className="p-2.5 text-cyan hover:text-ocean bg-cyan/10 rounded-xl transition font-bold" 
                          title="Edit Tour"
                        >
                          <HiPencil size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(tourId)} 
                          className="p-2.5 text-red-500 hover:text-red-700 bg-red-50 rounded-xl transition" 
                          title="Delete Tour"
                        >
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
            <div className="text-center py-16 text-slate-400 text-sm">
              No tour packages matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
