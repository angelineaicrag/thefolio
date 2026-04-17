import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Nav = ({ toggleDarkMode }) => {  // Add this prop
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header>
      <button onClick={toggleDarkMode} className="dark-btn">🌙 Dark Mode</button>
      <h1>Wattpad: Where Stories Live</h1>
      <nav>
        <ul>
          <li>
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </li>
          
          {user ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/create-post">New Post</Link></li>
              {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
              <li><button onClick={logout}>Logout ({user.name})</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;