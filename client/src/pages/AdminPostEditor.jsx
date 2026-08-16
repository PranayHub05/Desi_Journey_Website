import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, createPost, updatePost, deletePost } from '../services/api';
import { HiX, HiOutlineArrowLeft, HiOutlineDocumentText } from 'react-icons/hi';
import { formatDriveLink } from '../utils/media';

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    image: '',
    content: '',
    keywords: [],
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchPost(id)
        .then((data) => {
          setFormData({
            title: data.title || '',
            category: data.category || '',
            excerpt: data.excerpt || '',
            image: data.image || '',
            content: data.content || '',
            keywords: data.keywords || [],
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

  const handleAddKeyword = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault();
      const kw = keywordInput.trim().replace(/^#/, '');
      if (!formData.keywords.includes(kw)) {
        setFormData((prev) => ({
          ...prev,
          keywords: [...prev.keywords, kw],
        }));
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== kwToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditMode) {
        await updatePost(id, formData);
      } else {
        await createPost(formData);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/admin');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <HiOutlineArrowLeft /> Back to Overview
          </button>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            {isEditMode ? 'Edit Journal Entry' : 'Create Journal Entry'}
          </h1>
        </div>

        {isEditMode && (
          <button 
            onClick={handleDelete} 
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition self-start"
          >
            Delete Entry
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
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
            Article Content & Tags
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Article Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. The art of an unhurried Himalayan escape"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Slow travel, Passport notes..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Excerpt (Summary for Card)
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="2"
              placeholder="Short 1-2 sentence teaser summary..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Full Article Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              placeholder="Write paragraphs of article text here..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/15 font-medium"
              required
            />
          </div>

          {/* Keywords Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Search Keywords & Topics (Press Enter to add)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.keywords.map((kw) => (
                <span key={kw} className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan/15 text-cyan text-xs font-bold rounded-full">
                  #{kw}
                  <button type="button" onClick={() => handleRemoveKeyword(kw)} className="text-cyan/70 hover:text-cyan">
                    <HiX size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              value={keywordInput} 
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan" 
              placeholder="e.g. himalaya, trekking, wellness, peaceful..."
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4 justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/admin')} 
              className="px-6 py-3 font-bold text-xs text-slate-500 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="gold-button px-8 py-3 text-xs">
              {saving ? 'Saving Post...' : (isEditMode ? 'Update Journal Entry' : 'Publish Journal Entry')}
            </button>
          </div>
        </form>

        {/* Preview Column */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Journal Card Preview</h3>
              <HiOutlineDocumentText className="text-cyan" size={18} />
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="h-40 rounded-xl overflow-hidden bg-slate-200">
                {formData.image ? (
                  <img src={formData.image} alt={formData.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Image preview</div>
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan">{formData.category || 'CATEGORY'}</p>
              <h4 className="font-display font-bold text-slate-900 text-lg line-clamp-2">{formData.title || 'Article Title'}</h4>
              <p className="text-xs text-slate-500 line-clamp-3">{formData.excerpt || 'Article summary excerpt preview...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
