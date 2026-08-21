import { readCollection } from '../services/storage.service.js';

export const search = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.json({ tours: [], posts: [] });
    }

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      return res.json({ tours: [], posts: [] });
    }

    const tours = await readCollection('tours');
    const posts = await readCollection('posts');

    const scoreItem = (item, type) => {
      let score = 0;
      const keywords = item.keywords || [];
      const textToSearch = [
        item.title,
        item.description || item.excerpt || item.content,
        item.location,
        ...keywords
      ].filter(Boolean).join(' ').toLowerCase();

      for (const token of tokens) {
        // Simple substring match in keywords or text
        if (textToSearch.includes(token)) {
          score++;
        }
      }
      return score;
    };

    const scoredTours = tours.map(t => ({ ...t, _score: scoreItem(t, 'tour') })).filter(t => t._score > 0);
    const scoredPosts = posts.map(p => ({ ...p, _score: scoreItem(p, 'post') })).filter(p => p._score > 0);

    scoredTours.sort((a, b) => b._score - a._score);
    scoredPosts.sort((a, b) => b._score - a._score);

    // Remove _score before returning
    const finalTours = scoredTours.slice(0, 6).map(({ _score, ...rest }) => rest);
    const finalPosts = scoredPosts.slice(0, 3).map(({ _score, ...rest }) => rest);

    res.json({ tours: finalTours, posts: finalPosts });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
