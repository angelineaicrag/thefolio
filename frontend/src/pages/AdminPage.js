// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('users');
  const [selectedPost, setSelectedPost] = useState(null); // ADD THIS

  useEffect(() => {
    API.get('/admin/users').then(r => setUsers(r.data));
    API.get('/admin/posts').then(r => setPosts(r.data));
    API.get('/contact/admin').then(r => setMessages(r.data)).catch(err => console.log(err));
  }, []);

  const toggleStatus = async (id) => {
    const { data } = await API.put(`/admin/users/${id}/status`);
    setUsers(users.map(u => u._id === id ? data.user : u));
  };

  const removePost = async (id) => {
    await API.put(`/admin/posts/${id}/remove`);
    setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
  };

  const updateMessageStatus = async (id, status) => {
    try {
      const { data } = await API.put(`/contact/admin/${id}/status`, { status });
      setMessages(messages.map(m => m._id === id ? data : m));
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await API.delete(`/contact/admin/${id}`);
        setMessages(messages.filter(m => m._id !== id));
      } catch (err) {
        console.error('Error deleting message:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'unread': return '#ff4444';
      case 'read': return '#ffaa00';
      case 'replied': return '#44aa44';
      default: return '#888';
    }
  };

  // ADD THIS FUNCTION TO VIEW POST
  const viewPostContent = (post) => {
    setSelectedPost(post);
  };

  // ADD THIS FUNCTION TO CLOSE MODAL
  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <div className="admin-tabs">
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>
          Members ({users.length})
        </button>
        <button onClick={() => setTab('posts')} className={tab === 'posts' ? 'active' : ''}>
          All Posts ({posts.length})
        </button>
        <button onClick={() => setTab('messages')} className={tab === 'messages' ? 'active' : ''}>
          Messages ({messages.length})
        </button>
      </div>

      {tab === 'users' && (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                <td>
                  <button onClick={() => toggleStatus(u._id)}>
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'posts' && (
        <>
          <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <p><strong>Total Posts:</strong> {posts.length}</p>
            <p><strong>Published:</strong> {posts.filter(p => p.status === 'published').length}</p>
            <p><strong>Removed:</strong> {posts.filter(p => p.status === 'removed').length}</p>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td>
                    <button 
                      onClick={() => viewPostContent(p)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#ff6122', 
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {p.title}
                    </button>
                  </td>
                  <td>{p.author?.name}</td>
                  <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    {p.status === 'published' && (
                      <button onClick={() => removePost(p._id)} style={{ backgroundColor: 'red', color: 'white' }}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* POST CONTENT MODAL */}
      {selectedPost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={closeModal}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80%',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer'
            }}>✕</button>
            
            <h2>{selectedPost.title}</h2>
            <p><strong>Author:</strong> {selectedPost.author?.name}</p>
            <p><strong>Date:</strong> {new Date(selectedPost.createdAt).toLocaleString()}</p>
            {selectedPost.image && (
              <img 
                src={`http://localhost:5000/uploads/${selectedPost.image}`} 
                alt={selectedPost.title}
                style={{ maxWidth: '100%', borderRadius: '8px', margin: '10px 0' }}
              />
            )}
            <hr />
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {selectedPost.body}
            </div>
          </div>
        </div>
      )}

      {tab === 'messages' && (
        <>
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <p><strong>Total Messages:</strong> {messages.length}</p>
            <p><strong>Unread:</strong> {messages.filter(m => m.status === 'unread').length}</p>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m._id} style={{ backgroundColor: m.status === 'unread' ? '#fff3f3' : 'white' }}>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td><strong>{m.subject}</strong></td>
                  <td style={{ maxWidth: '300px' }}>
                    {m.message.length > 100 ? m.message.substring(0, 100) + '...' : m.message}
                  </td>
                  <td>
                    <select 
                      value={m.status} 
                      onChange={(e) => updateMessageStatus(m._id, e.target.value)}
                      style={{ 
                        backgroundColor: getStatusColor(m.status),
                        color: 'white',
                        padding: '5px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteMessage(m._id)} 
                      style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px' }}>No messages yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;