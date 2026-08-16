import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTour, createTour, updateTour, deleteTour } from '../services/api';
import { HiX, HiPlus, HiOutlineArrowLeft, HiStar, HiOutlineLocationMarker, HiOutlineClock, HiTrash, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineCalendar } from 'react-icons/hi';
import { formatDriveLink } from '../utils/media';

export default function AdminTourEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    price: '',
    rating: '4.9',
    description: '',
    image: '',
    images: [],
    keywords: [],
    inclusions: [],
    exclusions: [],
    terms: '',
    itinerary: [],
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [inclusionInput, setInclusionInput] = useState('');
  const [exclusionInput, setExclusionInput] = useState('');
  
  // New Day Itinerary input state
  const [newDay, setNewDay] = useState({
    day: 1,
    title: '',
    description: '',
    image: '',
    meals: '',
    extras: '',
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchTour(id)
        .then((data) => {
          const loadedItinerary = data.itinerary || [];
          setFormData({
            title: data.title || '',
            location: data.location || '',
            duration: data.duration || '',
            price: data.price || '',
            rating: data.rating || '4.9',
            description: data.description || '',
            image: data.image || '',
            images: data.images || [],
            keywords: data.keywords || [],
            inclusions: data.inclusions || [],
            exclusions: data.exclusions || [],
            terms: data.terms || '',
            itinerary: loadedItinerary,
          });
          setNewDay(prev => ({ ...prev, day: loadedItinerary.length + 1 }));
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

  /* Keyword Handlers */
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

  /* Gallery Handlers */
  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    const formatted = formatDriveLink(galleryInput);
    if (formatted.trim() && !formData.images.includes(formatted.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, formatted.trim()],
      }));
      setGalleryInput('');
    }
  };

  const handleRemoveGalleryImage = (imgToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imgToRemove),
    }));
  };

  /* Inclusions Handlers */
  const handleAddInclusion = (e) => {
    e.preventDefault();
    if (inclusionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, inclusionInput.trim()]
      }));
      setInclusionInput('');
    }
  };

  const handleRemoveInclusion = (index) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  /* Exclusions Handlers */
  const handleAddExclusion = (e) => {
    e.preventDefault();
    if (exclusionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, exclusionInput.trim()]
      }));
      setExclusionInput('');
    }
  };

  const handleRemoveExclusion = (index) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  /* Itinerary Handlers */
  const handleAddItineraryDay = (e) => {
    e.preventDefault();
    if (!newDay.title.trim()) return;

    const formattedDay = {
      ...newDay,
      image: formatDriveLink(newDay.image)
    };

    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, formattedDay]
    }));

    setNewDay({
      day: formData.itinerary.length + 2,
      title: '',
      description: '',
      image: '',
      meals: '',
      extras: ''
    });
  };

  const handleRemoveItineraryDay = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating),
      };

      if (isEditMode) {
        await updateTour(id, payload);
      } else {
        await createTour(payload);
      }
      navigate('/admin/tours');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await deleteTour(id);
        navigate('/admin/tours');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading tour details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/admin/tours')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <HiOutlineArrowLeft /> Back to Tours List
          </button>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            {isEditMode ? 'Edit Tour Package' : 'Create Tour Package'}
          </h1>
        </div>

        {isEditMode && (
          <button 
            onClick={handleDelete} 
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition self-start"
          >
            Delete Package
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-10">
        {/* SECTION 1: BASIC DETAILS */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Basic Tour Info & Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Tour Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Azure Andaman Escape"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Location / Destination
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Havelock & Neil Island"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 5 nights"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Starting Price (e.g. ₹32,900)
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="₹32,900"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Rating (0.0 to 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                max="5"
                min="0"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Overview Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Overview details about stays, pace, and destination..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Primary Photo URL (Google Drive links supported)
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/... or Google Drive Link"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan font-medium"
              required
            />
          </div>

          {/* Secondary Carousel Gallery */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Secondary Gallery Photos (Carousel)
            </label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={galleryInput} 
                onChange={(e) => setGalleryInput(e.target.value)} 
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-cyan"
                placeholder="Paste photo URL (or Google Drive Link) and click Add..."
              />
              <button 
                onClick={handleAddGalleryImage} 
                type="button" 
                className="px-4 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-cyan transition flex items-center gap-1.5"
              >
                <HiPlus /> Add Photo
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden shadow-xs border border-slate-200">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-20 object-cover" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveGalleryImage(img)} 
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition"
                    >
                      <HiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: DAY WISE ITINERARY BUILDER */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <HiOutlineCalendar className="text-cyan" /> 2. Day-Wise Itinerary Builder
          </h2>

          {/* List of Added Days */}
          {formData.itinerary.length > 0 && (
            <div className="space-y-3 mb-6">
              {formData.itinerary.map((dayItem, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-lg flex-shrink-0 mt-0.5">
                      Day {dayItem.day || idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{dayItem.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{dayItem.description}</p>
                      <div className="flex gap-4 text-[11px] text-slate-400 font-medium mt-1">
                        {dayItem.meals && <span>Meals: {dayItem.meals}</span>}
                        {dayItem.extras && <span className="text-ocean">Extras: {dayItem.extras}</span>}
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveItineraryDay(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition"
                  >
                    <HiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form to Add New Day */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Add Day {newDay.day} Itinerary
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Day No.</label>
                <input 
                  type="number" 
                  value={newDay.day} 
                  onChange={(e) => setNewDay({ ...newDay, day: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-10">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Day Title Headline</label>
                <input 
                  type="text" 
                  value={newDay.title} 
                  onChange={(e) => setNewDay({ ...newDay, title: e.target.value })}
                  placeholder="e.g. ARRIVE PORT BLAIR & CELLULAR JAIL TOUR"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Day Description</label>
                <textarea 
                  value={newDay.description} 
                  onChange={(e) => setNewDay({ ...newDay, description: e.target.value })}
                  rows="2"
                  placeholder="Day activities, transfers, sights..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium resize-none"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meals (e.g. Breakfast & Dinner)</label>
                <input 
                  type="text" 
                  value={newDay.meals} 
                  onChange={(e) => setNewDay({ ...newDay, meals: e.target.value })}
                  placeholder="e.g. Breakfast & Dinner"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Extra Toppings (e.g. Welcome Drinks)</label>
                <input 
                  type="text" 
                  value={newDay.extras} 
                  onChange={(e) => setNewDay({ ...newDay, extras: e.target.value })}
                  placeholder="e.g. Sunset Coconut Water"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Day Photo URL (Optional)</label>
                <input 
                  type="text" 
                  value={newDay.image} 
                  onChange={(e) => setNewDay({ ...newDay, image: e.target.value })}
                  placeholder="https://... or Google Drive Link"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleAddItineraryDay}
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-cyan transition inline-flex items-center gap-1.5"
            >
              <HiPlus /> Save & Add Day to Itinerary
            </button>
          </div>
        </div>

        {/* SECTION 3: INCLUSIONS & EXCLUSIONS */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            3. Inclusions, Exclusions & Terms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inclusions Builder */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <HiOutlineCheckCircle className="text-emerald-500" size={16} /> Inclusions List
              </label>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inclusionInput} 
                  onChange={(e) => setInclusionInput(e.target.value)} 
                  placeholder="e.g. All accommodation in Super deluxe category"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-cyan"
                />
                <button 
                  onClick={handleAddInclusion} 
                  type="button" 
                  className="px-3.5 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-xs hover:bg-emerald-700 transition"
                >
                  + Add
                </button>
              </div>

              <ul className="space-y-2 pt-2">
                {formData.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs text-slate-800 font-medium">
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> {item}
                    </span>
                    <button type="button" onClick={() => handleRemoveInclusion(idx)} className="text-red-500 hover:text-red-700">
                      <HiX size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions Builder */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <HiOutlineXCircle className="text-red-500" size={16} /> Exclusions List
              </label>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={exclusionInput} 
                  onChange={(e) => setExclusionInput(e.target.value)} 
                  placeholder="e.g. Entry fees of any place of interest"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-cyan"
                />
                <button 
                  onClick={handleAddExclusion} 
                  type="button" 
                  className="px-3.5 py-2.5 bg-red-600 text-white rounded-2xl font-bold text-xs hover:bg-red-700 transition"
                >
                  + Add
                </button>
              </div>

              <ul className="space-y-2 pt-2">
                {formData.exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2.5 bg-red-50/60 border border-red-200/60 rounded-xl text-xs text-slate-800 font-medium">
                    <span className="flex items-center gap-2">
                      <span className="text-red-500">✕</span> {item}
                    </span>
                    <button type="button" onClick={() => handleRemoveExclusion(idx)} className="text-red-500 hover:text-red-700">
                      <HiX size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Cancellation, Refund Policy & Terms and Conditions
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              rows="4"
              placeholder="State deposit conditions, cancellation timeline, non-refundable terms..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-900 outline-none focus:border-cyan font-medium"
            />
          </div>
        </div>

        {/* SECTION 4: KEYWORDS (FOR BACKEND SEARCH) */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Internal Search Keywords & Tags (Used by search bar)
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
            placeholder="Type keyword and press Enter..."
          />
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="pt-6 border-t border-slate-100 flex gap-4 justify-end">
          <button 
            type="button" 
            onClick={() => navigate('/admin/tours')} 
            className="px-6 py-3 font-bold text-xs text-slate-500 hover:text-slate-900 transition"
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className="gold-button px-8 py-3.5 text-xs">
            {saving ? 'Saving Package...' : (isEditMode ? 'Update Tour Package' : 'Publish Tour Package')}
          </button>
        </div>
      </form>
    </div>
  );
}
