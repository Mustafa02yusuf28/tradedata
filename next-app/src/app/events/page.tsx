import React from 'react';
import { getNewsFromDb, NewsItem } from '@/lib/news';

export const revalidate = 60; // Revalidate the page every 60 seconds

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

// Restoring the locally defined NewsItemCard component.
// Using basic divs for now to ensure the build passes.
function NewsItemCard({ item }: { item: NewsItem }) {
  return (
    <div className="news-item-card mb-4 break-inside-avoid p-4 border rounded-lg">
      <h3 className="text-lg leading-tight font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-400">{formatDate(item.timestamp)}</p>
    </div>
  );
}

export default async function EventsPage() {
  const { news, error } = await getNewsFromDb();

  return (
    <div className="max-w-7xl mx-auto pt-16 md:pt-24 px-4">
      <h1 className="text-5xl font-bold text-center text-white animate-glow strategies-title">
        Real-Time Financial Events
      </h1>
      

      {error ? (
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