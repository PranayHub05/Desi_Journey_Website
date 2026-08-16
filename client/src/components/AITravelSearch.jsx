import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineDocumentText } from 'react-icons/hi';
import { searchTrips } from '../services/api';

// Custom hook for debouncing values
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const COMMON_SEARCHES = ['Beach getaway', 'Mountain retreat', 'Honeymoon trip', 'Family vacation'];

export default function AITravelSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await searchTrips(searchQuery);
      setResults(data);
      setIsFocused(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults({ tours: [], posts: [] });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const showDropdown = isFocused && (query.length > 0 || results);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-50">
      <form 
        onSubmit={onSubmit}
        className={`relative flex items-center bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-2 transition-all duration-300 ${isFocused ? 'ring-4 ring-ocean/20 bg-white' : 'hover:bg-white'}`}
      >
        <div className="pl-4 text-ocean">
          <HiOutlineSearch size={24} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) setResults(null);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder="Search trips by keyword — beach, mountain, honeymoon..."
          className="w-full bg-transparent border-none outline-none text-ink px-4 py-3 text-lg placeholder:text-ink/40"
        />
        
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-gradient-to-r from-ocean to-cyan text-white font-bold rounded-xl shadow-lg hover:shadow-ocean/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-ink/5 overflow-hidden"
          >
            {!results && query.length > 0 && (
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/40 mb-3 px-2">Suggestions</p>
                {COMMON_SEARCHES.filter(s => s.toLowerCase().includes(debouncedQuery.toLowerCase())).map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-sand rounded-xl text-ink transition-colors flex items-center gap-3"
                  >
                    <HiOutlineSearch className="text-ink/40" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {results && (
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
                {(results.tours?.length === 0 && results.posts?.length === 0) && (
                  <div className="text-center py-8 text-ink/60">
                    No matching trips found. Try different keywords.
                  </div>
                )}

                {results.tours?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink/40 mb-3 px-2">Tours</p>
                    <div className="space-y-2">
                      {results.tours.map(tour => {
                        const tourId = tour.id || tour._id;
                        return (
                          <div 
                            key={tourId}
                            onClick={() => { navigate(`/tours/${tourId}`); setIsFocused(false); }}
                            className="flex items-center gap-4 p-3 hover:bg-sand rounded-xl cursor-pointer transition-colors"
                          >
                            <img src={tour.image} alt={tour.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                              <h4 className="font-bold text-ink">{tour.title}</h4>
                              <p className="text-sm text-ink/60 flex items-center gap-1">
                                <HiOutlineLocationMarker /> {tour.location} • {tour.price}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {results.posts?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink/40 mb-3 px-2">Travel Guides</p>
                    <div className="space-y-1">
                      {results.posts.map(post => {
                        const postId = post.id || post._id;
                        return (
                          <div 
                            key={postId}
                            onClick={() => { navigate(`/blog/${postId}`); setIsFocused(false); }}
                            className="flex items-center gap-3 p-3 hover:bg-sand rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="p-2 bg-ocean/10 text-ocean rounded-lg">
                              <HiOutlineDocumentText size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-ink text-sm">{post.title}</h4>
                              <p className="text-xs text-ink/50">{post.category}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
