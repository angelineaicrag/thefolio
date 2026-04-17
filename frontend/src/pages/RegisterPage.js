// src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',        // ADD THIS
    password: '',     // ADD THIS
    username: '',
    dob: '',
    interest: '',
    genre: '',
    terms: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = '⚠ Full name is required.';
    if (!formData.email.trim()) newErrors.email = '⚠ Email is required.';
    if (!formData.email.includes('@')) newErrors.email = '⚠ Enter a valid email address.';
    if (!formData.password) newErrors.password = '⚠ Password is required.';
    if (formData.password.length < 6) newErrors.password = '⚠ Password must be at least 6 characters.';
    if (!formData.username.trim()) newErrors.username = '⚠ Username is required.';
    
    if (!formData.dob) {
      newErrors.dob = '⚠ Date of birth is required.';
    } else {
      const age = calculateAge(formData.dob);
      if (age < 18) newErrors.dob = '⚠ You must be at least 18 years old.';
    }
    
    if (!formData.interest) newErrors.interest = '⚠ Please select an interest level.';
    if (!formData.genre) newErrors.genre = '⚠ Please select a favorite genre.';
    if (!formData.terms) newErrors.terms = '⚠ You must agree to the terms.';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Sending to backend:', {
          name: formData.fullname,
          email: formData.email,
          password: formData.password
        });
        
        const response = await API.post('/auth/register', {
          name: formData.fullname,
          email: formData.email,
          password: formData.password
        });
        
        console.log('Registration success:', response.data);
        setSubmitted(true);
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        console.error('Registration error:', err);
        setErrors({ submit: err.response?.data?.message || 'Registration failed. Email may already exist.' });
      }
    } else {
      console.log('Validation errors:', newErrors);
      setErrors(newErrors);
    }
  };

  if (submitted) {
    return (
      <section className="sign">
        <h2>🎉 Welcome to the Community, {formData.username}! 🎉</h2>
        <p>Thank you for registering!</p>
        <p>Your email: <strong>{formData.email}</strong></p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </section>
    );
  }

  return (
    <section className="sign">
      <h2>Sign Up for Reading Updates</h2>
      <p>Get book and story recommendations, reading tips, or new Wattpad finds straight to your inbox.</p>

      {errors.submit && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{errors.submit}</div>}

      <form className="register-form" onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input 
          type="text" 
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          className={errors.fullname ? 'error' : ''}
        />
        {errors.fullname && <div className="error-message">{errors.fullname}</div>}

        <label>Email Address:</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}

        <label>Password:</label>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min 6 characters"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <div className="error-message">{errors.password}</div>}

        <label>Preferred Username:</label>
        <input 
          type="text" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={errors.username ? 'error' : ''}
        />
        {errors.username && <div className="error-message">{errors.username}</div>}

        <label>Date of Birth:</label>
        <input 
          type="date" 
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className={errors.dob ? 'error' : ''}
        />
        {errors.dob && <div className="error-message">{errors.dob}</div>}

        <p>Interest Level:</p>
        {['Beginner', 'Intermediate', 'Avid Reader'].map(level => (
          <label key={level}>
            <input 
              type="radio" 
              name="interest" 
              value={level}
              checked={formData.interest === level}
              onChange={handleChange}
            /> {level}
          </label>
        ))}
        {errors.interest && <div className="error-message">{errors.interest}</div>}

        <p>Favorite Genre:</p>
        {['Romance', 'Fantasy', 'Teen Fiction', 'Adventure', 'Time Travel', 'Science Fiction'].map(genre => (
          <label key={genre}>
            <input 
              type="radio" 
              name="genre" 
              value={genre}
              checked={formData.genre === genre}
              onChange={handleChange}
            /> {genre}
          </label>
        ))}
        {errors.genre && <div className="error-message">{errors.genre}</div>}

        <label>
          <input 
            type="checkbox" 
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          /> I agree to the terms and conditions
        </label>
        {errors.terms && <div className="error-message">{errors.terms}</div>}

        <button type="submit">Register</button>
      </form>
    </section>
  );
}

export default RegisterPage;