"use client";
import React, { useEffect, useState } from "react";

// More specific finance-related keywords for both query and filtering
const FINANCE_KEYWORDS = [
  "stock market",
  "global stock market",
  "sensex",
  "nifty 50",
  "market crash",
  "market rally",
  "fed rate",
  "rbi policy",
  "federal reserve",
  "interest rates",
  "inflation",
  "geopolitical tension",
  "war market",
  "market volatility",
  "sebi regulation",
  "nifty index",
  "dow jones",
  "nasdaq",
  "s&p 500",
  "market impact",
  "economic outlook",
  "market news",
  "market selloff",
  "market rebound",
  "central bank",
  "bond yields",
  "currency market",
  "commodities market",
  "oil prices",
  "energy market",
  "earnings report",
  "market forecast",
  "nifty",
  "rbi",
  "fed",
  "sebi",
  "global market",
  "war",
 
  "nifty 100",
  "nifty 200",
  "nifty 300",
  "nifty 400",
  "nifty 500",
  "hdfc bank",
  "icici bank",
  "axis bank",
  "nvidia",
  "apple",
  "microsoft",
  "google",
  "amazon",
  
];

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string };
}

function isFinanceRelevant(article: GNewsArticle) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return FINANCE_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
}

export default function NewsPage() {
  const [articles, setArticles] = useState<GNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY || process.env.VITE_GNEWS_API_KEY;
        if (!apiKey) {
          setError("API key not found in environment variables.");
          setLoading(false);
          return;
        }
        // Use a more specific query for financial news
        const query = FINANCE_KEYWORDS.slice(0, 8).map(k => `\"${k}\"`).join(" OR ");
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=30&token=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        // Filter for finance-relevant news only
        const filtered = (data.articles || []).filter(isFinanceRelevant).slice(0, 10);
        setArticles(filtered);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <main className="main-content">
      <h1 className="dashboard-title">Market News</h1>
      {loading && (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <span className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
          <span style={{ marginLeft: 8 }}>Loading news...</span>
        </div>
      )}
      {error && (
        <div style={{ color: "#ff6b6b", textAlign: "center", margin: "2rem 0" }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        <div className="stats-grid">
          {articles.length === 0 && (
            <div style={{ color: "#fff", textAlign: "center", gridColumn: "1/-1" }}>
              No financial market news found for the selected keywords.
            </div>
          )}
          {articles.map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="stat-card news"
              style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 12,
                    marginBottom: 16,
                    background: "#222"
                  }}
                  loading="lazy"
                />
              )}
              <div className="stat-label" style={{ marginBottom: 8 }}>{article.source?.name}</div>
              <div className="stat-value" style={{ fontSize: "1.2rem", marginBottom: 8, color: "#fff", lineHeight: 1.2 }}>{article.title}</div>
              <div style={{ color: "#b5eaea", fontSize: 14, marginBottom: 8 }}>{article.description}</div>
              <div style={{ color: "#aaa", fontSize: 12, marginTop: "auto" }}>{new Date(article.publishedAt).toLocaleString()}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
} 