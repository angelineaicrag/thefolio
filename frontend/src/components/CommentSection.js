// frontend/src/components/CommentSection.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/${postId}`);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e, parentCommentId = null) => {
    e.preventDefault();
    const commentBody = parentCommentId ? replyText[parentCommentId] : newComment;
    if (!commentBody?.trim()) return;
    
    try {
      const { data } = await API.post(`/comments/${postId}`, {
        body: commentBody,
        parentComment: parentCommentId
      });
      
      if (parentCommentId) {
        fetchComments();
        setReplyText({ ...replyText, [parentCommentId]: '' });
        setShowReplyForm({ ...showReplyForm, [parentCommentId]: false });
      } else {
        setComments([data, ...comments]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await API.delete(`/comments/${commentId}`);
        fetchComments();
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p>Please <a href="/login">login</a> to leave a comment.</p>
      )}
      
      <div>
        {comments.length === 0 && <p>No comments yet. Be the first to comment!</p>}
        
        {comments.map(comment => (
          <div key={comment._id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>{comment.author?.name}</strong>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
            <p>{comment.body}</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {user && (
                <button onClick={() => setShowReplyForm({ ...showReplyForm, [comment._id]: !showReplyForm[comment._id] })}>
                  Reply
                </button>
              )}
              {(user?._id === comment.author?._id || user?.role === 'admin') && (
                <button onClick={() => handleDeleteComment(comment._id)} style={{ color: 'red' }}>
                  Delete
                </button>
              )}
            </div>
            
            {showReplyForm[comment._id] && (
              <form onSubmit={(e) => handleAddComment(e, comment._id)} style={{ marginTop: '15px', marginLeft: '20px' }}>
                <textarea
                  value={replyText[comment._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                  placeholder="Write a reply..."
                  rows="2"
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  required
                />
                <button type="submit">Post Reply</button>
              </form>
            )}
            
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginLeft: '30px', marginTop: '15px', borderLeft: '2px solid #ddd', paddingLeft: '15px' }}>
                {comment.replies.map(reply => (
                  <div key={reply._id} style={{ 
                    border: '1px solid #eee', 
                    padding: '10px', 
                    margin: '10px 0', 
                    borderRadius: '5px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong>{reply.author?.name}</strong>
                      <small>{new Date(reply.createdAt).toLocaleString()}</small>
                    </div>
                    <p>{reply.body}</p>
                    {(user?._id === reply.author?._id || user?.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(reply._id)} style={{ color: 'red', fontSize: '12px' }}>
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;