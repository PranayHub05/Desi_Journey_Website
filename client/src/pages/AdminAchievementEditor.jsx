import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAchievement, createAchievement, updateAchievement, deleteAchievement } from '../services/api';
import { HiX, HiOutlineArrowLeft, HiOutlineBadgeCheck, HiOutlineUpload } from 'react-icons/hi';
import { formatDriveLink } from '../utils/media';

export default function AdminAchievementEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Certificates',
    issuer: '',
    year: new Date().getFullYear().toString(),
    image: '',
    description: '',
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchAchievement(id)
        .then((data) => {
          setFormData({
            title: data.title || '',
            category: data.category || 'Certificates',
            issuer: data.issuer || '',
            year: data.year || '',
            image: data.image || '',
            description: data.description || '',
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'image' ? formatDriveLink(value) : value 
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3.5 * 1024 * 1024) {
      setError('Please select an image file smaller than 3MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditMode) {
        await updateAchievement(id, formData);
      } else {
        await createAchievement(formData);
      }
      navigate('/admin/achievements');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this achievement certificate?')) {
      try {
        await deleteAchievement(id);
        navigate('/admin/achievements');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading certificate details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/admin/achievements')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <HiOutlineArrowLeft /> Back to Achievements
          </button>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            {isEditMode ? 'Edit Achievement Certificate' : 'Add New Achievement / Certificate'}
          </h1>
        </div>

        {isEditMode && (
          <button 
            onClick={handleDelete} 
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition self-start"
          >
            Delete Certificate
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
            Certificate & Recognition Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Certificate / Award Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Ministry of Tourism Recognition Certificate"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan font-medium"
              >
                <option value="Certificates">Certificates</option>
                <option value="Accolades">Accolades</option>
                <option value="Recognitions">Recognitions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Issuing Organization / Authority
              </label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                placeholder="e.g. Department of Tourism, Govt. of India"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Year Issued
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2024"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Description / Citation Summary
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief details about the recognition or certificate award..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan font-medium resize-none"
              required
            />
          </div>

          {/* Certificate Image Upload (<3MB / URL) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Certificate Photo / Document Image (&lt; 3MB)
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition inline-flex items-center gap-2">
                  <HiOutlineUpload size={16} /> Select Photo (&lt;3MB)
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
                <span className="text-xs text-slate-400 font-medium">or paste image URL</span>
              </div>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or upload file above"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4 justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/admin/achievements')} 
              className="px-6 py-3 font-bold text-xs text-slate-500 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="gold-button px-8 py-3 text-xs">
              {saving ? 'Saving...' : (isEditMode ? 'Update Certificate' : 'Save Certificate')}
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Certificate Card Preview</h3>
              <HiOutlineBadgeCheck className="text-cyan" size={20} />
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="h-44 rounded-xl overflow-hidden bg-slate-200 relative border border-slate-200">
                {formData.image ? (
                  <img src={formData.image} alt={formData.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Certificate preview</div>
                )}
                <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-white/90 text-slate-900 text-[10px] font-bold uppercase rounded-md">
                  {formData.category}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>{formData.issuer || 'Issuing Authority'}</span>
                <span>{formData.year}</span>
              </div>
              <h4 className="font-display font-bold text-slate-900 text-base">{formData.title || 'Certificate Title'}</h4>
              <p className="text-xs text-slate-500 line-clamp-3">{formData.description || 'Description preview...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
