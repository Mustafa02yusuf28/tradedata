import React from 'react';

// This line tells Next.js to treat this page as a fully dynamic page
export const dynamic = 'force-dynamic';

// Define a type for a single news item for type safety
type NewsItem = {
  _id: string;
  title: string;
  timestamp: string;
};

async function getNews(): Promise<{ news?: NewsItem[], error?: string }> {
  // This will be replaced by the actual API endpoint in a production environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${apiUrl}/api/news`, {
      cache: 'no-store', // Always fetch the latest news
    });

    if (!res.ok) {
      // Log the error for debugging purposes on the server
      console.error(`Failed to fetch news: ${res.status} ${res.statusText}`);
      return { error: 'Failed to load news feed. Please try again later.' };
    }

    const data = await res.json();
    return { news: data.news };
  } catch (error) {
    console.error('An error occurred while fetching news:', error);
    return { error: 'An unexpected error occurred. Please check the server logs.' };
  }
}

// Helper function to format the date nicely
function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    hour12: false,
    timeZone: 'UTC' // Displaying in UTC for consistency
  });
}

export default async function EventsPage() {
  const { news, error } = await getNews();

  return (
    <div className="max-w-7xl mx-auto pt-16 md:pt-24 px-4">
      <h1 className="text-5xl font-bold text-center text-white animate-glow strategies-title">
        Real-Time Financial Events
      </h1>
      

      {error ? (
        <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg">
          <p className="font-semibold">Could not load news feed</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <ul>
            {news && news.map((item: NewsItem) => (
              <li key={item._id} className="news-item-card">
                <h2>{item.title}</h2>
                <p>
                  {formatDate(item.timestamp)} UTC
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 