import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { loadPosts, seedPosts, videoSource, type Post } from './posts';
import './styles.css';

function Category({ post }: { post: Post }) {
  return <span className="category" style={{ backgroundColor: post.category_color }}>{post.category}</span>;
}

function Video({ post }: { post: Post }) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Resume muted previews when browsers suspend offscreen autoplay.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) void video.play().catch(() => {});
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <div className="video-frame" tabIndex={0} aria-label={`${post.title} — video preview`}>
    <video ref={videoRef} src={videoSource(post)} poster={post.image_url || undefined} autoPlay loop muted playsInline preload="auto" onError={() => setFailed(true)} />
    {failed && <span className="video-unavailable">Video preview unavailable</span>}
    <div className="video-overlay" aria-hidden="true" />
    <span className="corner top-left" aria-hidden="true" /><span className="corner top-right" aria-hidden="true" />
    <span className="corner bottom-left" aria-hidden="true" /><span className="corner bottom-right" aria-hidden="true" />
    <span className="preview-plus" aria-hidden="true"><span /><span /></span>
  </div>;
}

function App() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [failed, setFailed] = useState(false);
  useEffect(() => { let active = true; loadPosts().then(data => { if (active) setPosts(data); }).catch(() => { if (active) setFailed(true); }); return () => { active = false; }; }, []);
  const featured = posts.find(post => post.type === 'featured');
  return <main className="blog">
    <header className="blog-header">
      <span className="eyebrow">Blog</span>
      <h1>Behind the lens</h1>
      <div className="header-bottom">
        <p>Thoughts, insights, and stories from my photography journey. Take a peek into my creative process and recent projects.</p>
        <a className="all-posts" href="#posts">View all posts <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
      </div>
    </header>
    {failed && <p className="data-notice" role="status">Live posts are unavailable. Showing the latest saved collection.</p>}
    {featured && <article className="featured">
      <Video post={featured} />
      <div className="featured-content">
        {featured.badge && <span className="must-read">{featured.badge}</span>}
        <h2>{featured.title}</h2>
        <p className="description">{featured.description}</p>
        <div className="featured-footer"><span>{featured.author}</span><Category post={featured} /></div>
      </div>
    </article>}
    <section className="post-grid" id="posts" aria-label="All photography posts" tabIndex={-1}>
      {posts.filter(post => post.type === 'standard').map(post => <article className="post" key={post.id}><Video post={post} /><div className="post-caption"><h2>{post.title}</h2><Category post={post} /></div></article>)}
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
