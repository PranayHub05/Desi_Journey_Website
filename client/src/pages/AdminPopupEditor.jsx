import { useState, useEffect } from 'react';
import { fetchPopups, createPopup, updatePopup, deletePopup } from '../services/api';
import { formatDriveLink } from '../utils/media';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiX, HiOutlineSparkles, HiOutlineArrowLeft, HiOutlinePhotograph, HiOutlineUpload, HiOutlineExclamationCircle, HiOutlineLogin } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminPopupEditor() {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    message: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    active: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);

  const loadPopups = async () => {
    try {
      const data = await fetchPopups();
      setPopups(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthError(true);
        setError('Your admin session has expired. Please log in again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopups();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (name === 'image' ? formatDriveLink(value) : value) 
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3.5 * 1024 * 1024) {
      setError('Please select an image smaller than 3MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (popup) => {
    const popupId = popup.id || popup._id;
    setFormData({
      id: popupId,
      title: popup.title,
      message: popup.message,
      image: popup.image || '',
      ctaText: popup.ctaText || '',
      ctaLink: popup.ctaLink || '',
      active: popup.active || false,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setFormData({ id: null, title: '', message: '', image: '', ctaText: '', ctaLink: '', active: false });
    setIsEditing(false);
    setError('');
    setIsAuthError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setIsAuthError(false);

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        image: formatDriveLink(formData.image),
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        active: formData.active,
      };

      if (formData.id) {
        await updatePopup(formData.id, payload);
      } else {
        await createPopup(payload);
      }
      
      await loadPopups();
      handleCancel();
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthError(true);
        setError('Your admin session has expired or authentication failed. Please log in again to save changes.');
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this popup?')) {
      try {
        await deletePopup(id);
        await loadPopups();
      } catch (err) {
        if (err.response?.status === 401) {
          setIsAuthError(true);
          setError('Session expired. Please log in again.');
        } else {
          setError(err.response?.data?.message || err.message);
        }
      }
    }
  };

  const handleToggleActive = async (popup) => {
    const popupId = popup.id || popup._id;
    try {
      await updatePopup(popupId, { ...popup, active: !popup.active });
      await loadPopups();
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthError(true);
        setError('Session expired. Please log in again.');
      } else {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading popup configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <HiOutlineArrowLeft /> Back to Overview
          </button>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Popup & Alert Announcements
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HiOutlineExclamationCircle size={18} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          {isAuthError && (
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <HiOutlineLogin size={14} /> Log In Now
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form Column */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>{isEditing ? 'Edit Popup Announcement' : 'Configure New Popup'}</span>
              {isEditing && (
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">Editing Mode</span>
              )}
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Announcement Headline / Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. ✨ Winter Monsoon Upgrades Announced!"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Popup Message Body
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Details about upcoming bookings, discounts, or exclusive tours..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium resize-none"
                required
              />
            </div>

            {/* Popup Banner Photo (<3MB Upload / Google Drive URL) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Popup Banner Photo (&lt; 3MB or Drive Link)
              </label>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition inline-flex items-center gap-2">
                    <HiOutlineUpload size={16} /> Choose Photo (&lt;3MB)
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                  <span className="text-xs text-slate-400 font-medium">or paste image / Google Drive URL</span>
                </div>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/... or Google Drive link"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-cyan font-medium"
                />

                {formData.image && (
                  <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-200 group">
                    <img src={formData.image} alt="Popup Banner" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full opacity-90 hover:opacity-100 transition"
                    >
                      <HiX size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Call-To-Action Text
                </label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleChange}
                  placeholder="e.g. Explore Offers"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  CTA Link / URL
                </label>
                <input
                  type="text"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleChange}
                  placeholder="e.g. /destinations"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
              <input 
                type="checkbox" 
                name="active" 
                checked={formData.active} 
                onChange={handleChange} 
                className="w-5 h-5 rounded text-cyan focus:ring-cyan" 
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Activate Immediately on Website</p>
                <p className="text-[11px] text-slate-500">When enabled, visitors will see this popup on landing.</p>
              </div>
            </label>

            <div className="pt-4 flex gap-3">
              {isEditing && (
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="flex-1 py-3 font-bold text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={saving} 
                className="flex-1 gold-button py-3.5 text-xs text-center"
              >
                {saving ? 'Saving...' : (isEditing ? 'Update Popup' : 'Create & Save Popup')}
              </button>
            </div>
          </form>

          {/* Existing Popups List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">All Configured Popups</h3>
            <div className="space-y-3">
              {popups.map((popup) => {
                const popupId = popup.id || popup._id;
                return (
                  <div key={popupId} className={`p-4 rounded-2xl border transition-all ${popup.active ? 'border-cyan bg-cyan/5' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {popup.image && (
                          <img src={popup.image} alt={popup.title} className="w-10 h-10 rounded-xl object-cover" />
                        )}
                        <h4 className="font-bold text-sm text-slate-900">{popup.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleActive(popup)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition ${
                            popup.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {popup.active ? '● Live' : 'Disabled'}
                        </button>
                        <button onClick={() => handleEdit(popup)} className="p-1 text-cyan hover:bg-cyan/10 rounded-lg">
                          <HiPencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(popupId)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg">
                          <HiTrash size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{popup.message}</p>
                  </div>
                );
              })}
              {popups.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">No popups created yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Live Visitor Popup Simulator Column */}
        <div className="lg:col-span-6 space-y-4 sticky top-24">
          <div className="bg-[#081325] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-1.5">
                <HiOutlineSparkles /> Live Visitor Simulator
              </span>
              <span className="text-[10px] text-white/50 bg-white/10 px-2.5 py-1 rounded-full">Modal Preview</span>
            </div>

            {/* Simulated Website Backdrop */}
            <div className="relative rounded-2xl bg-[#0d213f] p-8 border border-white/10 min-h-[380px] flex items-center justify-center">
              {/* Simulated Visitor Popup Card */}
              <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl text-center relative border border-white/20">
                {formData.image && (
                  <div className="h-44 w-full overflow-hidden relative">
                    <img src={formData.image} alt="Popup Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                )}

                <div className="p-6">
                  <button className="absolute top-3 right-3 text-slate-300 hover:text-slate-600 z-10 bg-white/80 rounded-full p-1">
                    <HiX size={16} />
                  </button>

                  <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                    {formData.title || 'Headline Text Here'}
                  </h3>
                  
                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    {formData.message || 'Your announcement message will be rendered here for website visitors.'}
                  </p>

                  {formData.ctaText && (
                    <button className="gold-button w-full py-3 text-xs shadow-md">
                      {formData.ctaText}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-white/50 text-center mt-4">
              This preview matches the exact modal styling shown to visitors upon landing on Desi Journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
