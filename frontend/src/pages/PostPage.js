// frontend/src/pages/PostPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import CommentSection from '../components/CommentSection';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, navigate]);

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      
      <div style={{ display: 'flex', gap: '10px', color: '#666', marginBottom: '20px' }}>
        <span>By: {post.author?.name}</span>
        <span>Date: {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      
      {post.image && (
        <img 
          src={`http://localhost:5000/uploads/${post.image}`} 
          alt={post.title}
          style={{ maxWidth: '100%', marginBottom: '20px' }}
        />
      )}
      
      <div style={{ lineHeight: '1.6', marginBottom: '30px' }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
      </div>
      
      {/* Edit and Delete buttons for post owner or admin */}
      {(user?._id === post.author?._id || user?.role === 'admin') && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => navigate(`/edit-post/${id}`)} 
            style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', cursor: 'pointer' }}
          >
            Edit Post
          </button>
          <button 
            onClick={handleDeletePost} 
            style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', cursor: 'pointer' }}
          >
            Delete Post
          </button>
        </div>
      )}
      
      {/* Comment Section */}
      <CommentSection postId={id} />
      
      <br />
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default PostPage;