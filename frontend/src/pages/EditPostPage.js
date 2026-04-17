// frontend/src/pages/EditPostPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const EditPostPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        // Check if user is authorized to edit
        if (data.author._id !== user?._id && user?.role !== 'admin') {
          navigate('/');
          return;
        }
        setTitle(data.title);
        setBody(data.body);
        setCurrentImage(data.image || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        navigate('/');
      }
    };
    
    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);
    
    try {
      const { data } = await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Edit Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        
        <div>
          <label>Content:</label>
          <br />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="12"
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        
        {currentImage && (
          <div style={{ marginBottom: '10px' }}>
            <label>Current Image:</label>
            <br />
            <img 
              src={`http://localhost:5000/uploads/${currentImage}`} 
              alt="Current"
              style={{ maxWidth: '200px', marginTop: '5px' }}
            />
          </div>
        )}
        
        {user?.role === 'admin' && (
          <div style={{ marginBottom: '10px' }}>
            <label>Change Image (optional):</label>
            <br />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        )}
        
        <button type="submit">Update Post</button>
        <button 
          type="button" 
          onClick={() => navigate(`/posts/${id}`)}
          style={{ marginLeft: '10px', backgroundColor: '#666' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;