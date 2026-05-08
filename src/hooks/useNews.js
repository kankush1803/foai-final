import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getCached, setCache } from '../utils/cache';

const CATEGORIES = ['technology', 'sports', 'business', 'health', 'science'];
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const PAGE_SIZE = 10;

// Google News RSS category topics
const GNEWS_TOPICS = {
  technology: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB',
  sports: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB',
  business: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB',
  health: 'CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRJU0FtVnVLQUFQAQ',
  science: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB',
};

function getNewsApiUrl(category) {
  const key = import.meta.env.VITE_NEWS_API_KEY;
  const base = '/api/news';
  return `${base}?category=${category}&apiKey=${key}&pageSize=${PAGE_SIZE}&country=us`;
}

function getGoogleNewsUrl(category) {
  const topic = GNEWS_TOPICS[category];
  if (topic) {
    return `/api/gnews/rss/topics/${topic}?hl=en-US&gl=US&ceid=US:en`;
  }
  return `/api/gnews/rss?hl=en-US&gl=US&ceid=US:en`;
}

// Parse Google News RSS XML into article objects matching NewsAPI format
function parseRSS(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items = doc.querySelectorAll('item');
  const articles = [];

  items.forEach((item, i) => {
    if (i >= PAGE_SIZE) return;

    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';

    // Extract source from title (Google News format: "Title - Source")
    const parts = title.split(' - ');
    const sourceName = parts.length > 1 ? parts.pop().trim() : 'Google News';
    const cleanTitle = parts.join(' - ').trim();

    // Try to extract image from description HTML
    let urlToImage = null;
    const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
    if (imgMatch) urlToImage = imgMatch[1];

    articles.push({
      title: cleanTitle,
      url: link,
      publishedAt: pubDate,
      source: { name: sourceName },
      description: description.replace(/<[^>]*>/g, '').trim().slice(0, 200),
      urlToImage,
    });
  });

  return articles;
}

export function useNews() {
  const [articlesByCategory, setArticlesByCategory] = useState({});
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'source'
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const hasNewsApiKey = (() => {
    const key = import.meta.env.VITE_NEWS_API_KEY;
    return key && key !== 'your_newsapi_key_here';
  })();

  const fetchCategory = useCallback(async (category, bypassCache = false) => {
    const cacheKey = `news_${category}`;

    if (!bypassCache) {
      const cached = getCached(cacheKey, CACHE_TTL);
      if (cached) {
        setArticlesByCategory((prev) => ({ ...prev, [category]: cached }));
        return;
      }
    }

    setLoading((prev) => ({ ...prev, [category]: true }));
    setErrors((prev) => ({ ...prev, [category]: null }));

    try {
      let articles;

      if (hasNewsApiKey) {
        // Use NewsAPI if key is available
        const { data } = await axios.get(getNewsApiUrl(category));
        articles = data.articles || [];
      } else {
        // Fallback to Google News RSS (free, no key needed)
        const { data: xmlText } = await axios.get(getGoogleNewsUrl(category), {
          responseType: 'text',
          headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
        });
        articles = parseRSS(xmlText);
      }

      setArticlesByCategory((prev) => ({ ...prev, [category]: articles }));
      setCache(cacheKey, articles);
    } catch (err) {
      let msg = err.message || 'Failed to fetch news';
      if (err.response?.status === 401) {
        msg = 'Invalid NewsAPI key. Using Google News as fallback failed too.';
      }
      setErrors((prev) => ({ ...prev, [category]: msg }));
    } finally {
      setLoading((prev) => ({ ...prev, [category]: false }));
    }
  }, [hasNewsApiKey]);

  const fetchAll = useCallback(() => {
    CATEGORIES.forEach((cat) => fetchCategory(cat));
  }, [fetchCategory]);

  const refreshCategory = useCallback(
    (category) => {
      fetchCategory(category, true);
    },
    [fetchCategory]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filtered + sorted articles for active category
  const rawArticles = articlesByCategory[activeCategory] || [];
  const filtered = rawArticles.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.description && a.description.toLowerCase().includes(q)) ||
      (a.source?.name && a.source.name.toLowerCase().includes(q))
    );
  });
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    }
    return (a.source?.name || '').localeCompare(b.source?.name || '');
  });

  // Category counts for doughnut chart
  const categoryCounts = CATEGORIES.map(
    (cat) => (articlesByCategory[cat] || []).length
  );

  return {
    categories: CATEGORIES,
    activeCategory,
    setActiveCategory,
    articles: sorted,
    allArticles: articlesByCategory,
    categoryCounts,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    loading: loading[activeCategory] || false,
    loadingMap: loading,
    errors,
    refreshCategory,
    fetchAll,
  };
}
