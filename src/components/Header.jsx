import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Don’t render on login/register or while checking auth
  if (pathname === '/login' || pathname === '/register' || loading) return null;

  return (
    <header className="bg-softGreen text-cream px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-2xl font-bold hover:text-coral">Kanvelope</Link>

      <nav className="space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-coral">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-coral px-4 py-1 rounded hover:bg-pink-400 text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-coral">Login</Link>
            <Link to="/register" className="hover:text-coral">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
