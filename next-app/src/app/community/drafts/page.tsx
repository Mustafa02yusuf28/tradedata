"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Draft {
  _id: string;
  title: string;
  description: string;
  updatedAt: string;
}

export default function MyDraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrafts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/blog?drafts=true");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch drafts");
        setDrafts(data.posts || []);
      } catch {
        setError("Failed to fetch drafts");
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, []);

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: true }),
      });
      if (!res.ok) throw new Error("Failed to publish draft");
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Failed to publish draft");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete draft');
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert('Failed to delete draft');
    }
  };

  return (
    <div className="blog-create-container">
      <div className="blog-create-content">
        <div className="blog-create-header">
          <h1 className="blog-create-title">My Drafts</h1>
          <div style={{ display: 'flex', gap: 16, margin: '16px 0 24px 0' }}>
            <Link href="/community" className="blog-content-btn neon-btn">
              Back to Community
            </Link>
            <Link href="/community/create" className="blog-content-btn neon-btn">
              Create New Post
            </Link>
          </div>
          <p className="blog-create-subtitle">Your saved (unpublished) blog posts</p>
        </div>
        {loading ? (
          <div>Loading drafts...</div>
        ) : error ? (
          <div style={{ color: "#ff6b6b" }}>{error}</div>
        ) : drafts.length === 0 ? (
          <div>No drafts found.</div>
        ) : (
          <div className="blog-content-blocks">
            {drafts.map((draft) => (
              <div key={draft._id} className="blog-content-block">
                <h2 style={{ marginBottom: 4 }}>{draft.title}</h2>
                <div style={{ color: "#b5eaea", marginBottom: 8 }}>{draft.description}</div>
                <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>
                  Last updated: {new Date(draft.updatedAt).toLocaleString()}
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                  <Link href={`/community/edit/${draft._id}`} className="blog-content-btn neon-btn">
                    Edit
                  </Link>
                  <button
                    className="blog-content-btn neon-btn neon-btn-green"
                    onClick={() => handlePublish(draft._id)}
                  >
                    Publish
                  </button>
                  <button
                    className="blog-content-btn neon-btn neon-btn-danger"
                    onClick={() => handleDelete(draft._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 