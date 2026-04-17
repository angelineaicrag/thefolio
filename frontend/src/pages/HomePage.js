// src/pages/HomePage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import wlogo from '../assets/wlogo.png';
import hes from '../assets/hes.jpg';
import us from '../assets/us.jpg';
import cs from '../assets/cs.jpg';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* YOUR EXISTING PHASE 1 CONTENT - KEPT EXACTLY AS IS */}
      <section className="hero">
        <img src={wlogo} width="100" height="100" alt="Wattpad logo" />
        <h2>"Once You Enter There's No Turning Back"</h2>
        <p>
          Welcome to My Wattpad Reading Space. This is a personal portfolio that showcases my journey as a Wattpad reader. 
          Here, I share my favorite stories, the genres I enjoy, and how reading became an important part of my life.
        </p>
      </section>

      <section className="wilw">
        <h3>Why I Love Wattpad</h3>
        <ul>
          <li>A wide variety of genres to explore</li>
          <li>Stories that feel relatable and emotional</li>
          <li>Easy access to stories anytime, anywhere</li>
          <li>A community where readers feel connected</li>
        </ul>
      </section>

      <section className="favorites">
        <p>My Favorites of all Time</p>
        <p>These stories left a lasting impression on me and are the ones I always come back to.</p>
      </section>

      <section className="previews">
        <div className="cards">
          <img src={hes} alt="Maxinejiji stories" />
          <h4>Maxinejiji Stories</h4>
          <p>A story that inspired me and I can't stop thinking about.</p>
        </div>

        <div className="cards">
          <img src={us} alt="University Series" />
          <h4>University Series</h4>
          <p>Another amazing read that keeps me coming back for more.</p>
        </div>

        <div className="cards">
          <img src={cs} alt="College Series" />
          <h4>College Series</h4>
          <p>Stories that taught me so many lessons I'll never forget.</p>
        </div>
      </section>

      {/* PHASE 2 BLOG POSTS SECTION - ADDED AT THE BOTTOM */}
      <section className="blog-section">
        <h2>Latest Community Posts</h2>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Be the first to write one!</p>
        ) : (
          <div className="blog-grid">
            {posts.map(post => (
              <div key={post._id} className="blog-card">
                {post.image && (
                  <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} />
                )}
                <h3>{post.title}</h3>
                <p>By: {post.author?.name}</p>
                <p>{post.body.substring(0, 100)}...</p>
                <Link to={`/posts/${post._id}`}>Read More →</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;