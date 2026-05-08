// Vercel serverless function to proxy NewsAPI requests (avoids CORS)
export default async function handler(req, res) {
  const { category = 'technology', pageSize = '10', country = 'us' } = req.query;
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'NEWS_API_KEY not configured' });
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&country=${encodeURIComponent(country)}&pageSize=${encodeURIComponent(pageSize)}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
