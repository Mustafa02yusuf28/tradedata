"use client";

import { useState, useEffect } from 'react';

// Define the NewsItem type for client-side usage
interface NewsItem {
  _id: string;
  title: string;
  timestamp: string;
}

// Helper function to format the date nicely
function formatDate(isoString: string) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// The card component for displaying a single news item
function NewsItemCard({ item }: { item: NewsItem }) {
  return (
    <div className="news-item-card mb-4 break-inside-avoid p-4 border rounded-lg">
      <h3 className="text-lg leading-tight font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-400">{formatDate(item.timestamp)}</p>
    </div>
  );
}

export default function EventsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      if (!res.ok) {
        throw new Error('Failed to fetch news feed.');
      }
      const data = await res.json();
      setNews(data.news);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch news immediately on component mount
    fetchNews();

    // Then fetch news every 30 seconds
    const interval = setInterval(fetchNews, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="events-title">
        Economic Events Feed
      </h1>
      
      {isLoading ? (
        <div className="text-center text-gray-400">Loading latest news...</div>
      ) : error ? (
        <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg">
          <p className="font-semibold">Could not load news feed</p>
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {news?.map((item) => (
            <NewsItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
} 