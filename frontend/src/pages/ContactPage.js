// src/pages/ContactPage.js
import { useState } from 'react';
import API from '../api/axios';  // ADD THIS IMPORT

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',     // ADD SUBJECT FIELD
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);  // ADD LOADING STATE

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email address.';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {  // MAKE THIS ASYNC
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // SEND TO BACKEND
        await API.post('/contact', {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        console.log('Form submitted:', formData);
        setSubmitted(true);
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to send message. Please try again.' });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <section className="git">
        <h2>Get in Touch</h2>
        <p>Feel free to reach out if you want to share book recommendations, favorite Wattpad stories, or thoughts about reading.</p>

        {errors.submit && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errors.submit}</div>}

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}

            <label>Email:</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}

            <label>Subject:</label>
            <input 
              type="text" 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              className={errors.subject ? 'error' : ''}
            />
            {errors.subject && <div className="error-message">{errors.subject}</div>}

            <label>Message:</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <div className="error-message">{errors.message}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h3>✅ Thank you, {formData.name}!</h3>
            <p>Your message has been received. The admin will get back to you soon!</p>
            <button onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}>Send Another Message</button>
          </div>
        )}
      </section>

      <section className="rr">
        <h2>Reading Resources</h2>
        <table>
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Wattpad</td><td>Online platform for reading and discovering stories</td></tr>
            <tr><td>Goodreads</td><td>Track books, reviews, and reading goals</td></tr>
            <tr><td>Webtoon</td><td>Visual stories and webcomics</td></tr>
            <tr><td>Archive of Our Own</td><td>Fan-made stories and creative works</td></tr>
          </tbody>
        </table>
      </section>

      <section className="atp">
        <h2>About This Page</h2>
        <p>This contact page is for readers who want to connect, recommend stories, or share their love for reading.</p>
      </section>

      <section className="urls">
        <h2>Useful Reading Links</h2>
        <ul>
          <li><a href="https://www.wattpad.com" target="_blank" rel="noopener noreferrer">Wattpad</a></li>
          <li><a href="https://www.goodreads.com" target="_blank" rel="noopener noreferrer">Goodreads</a></li>
          <li><a href="https://www.webtoon.com" target="_blank" rel="noopener noreferrer">Webtoon</a></li>
        </ul>
      </section>
    </>
  );
}

export default ContactPage;