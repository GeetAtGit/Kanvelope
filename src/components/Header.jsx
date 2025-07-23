// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import PremiumButton from '../components/PremiumButton';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const navigate    = useNavigate();
  const { pathname }= useLocation();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (pathname === '/login' || pathname === '/register' || loading) return null;

  const commonLinks = user
    ? <Link to="/dashboard" className="hover:text-coral">Dashboard</Link>
    : <Link to="/login"     className="hover:text-coral">Login</Link>;

  return (
    <header className="bg-softGreen text-cream px-6 py-4 shadow">
      {/* top row: brand + hamburger + desktop nav */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold hover:text-coral">
          Kanvelope
        </Link>

        {/* desktop nav */}
        <nav className="hidden sm:flex items-center space-x-4">
          {commonLinks}
          <PremiumButton />
          {user
            ? <button
                onClick={handleLogout}
                className="bg-yellow-400/50 px-4 py-1 rounded hover:bg-yellow-400 hover:text-gray-500 text-white"
              >
                Logout
              </button>
            : <Link to="/register" className="hover:text-coral">Register</Link>
          }
        </nav>

        {/* mobile hamburger */}
        <button
          className="sm:hidden p-2"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* mobile nav */}
      {mobileOpen && (
        <nav className="sm:hidden mt-4 flex flex-col space-y-2">
          {commonLinks}
          <PremiumButton />
          {user
            ? <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="bg-yellow-400/50 px-4 py-1 rounded hover:bg-yellow-400 hover:text-gray-500 text-white text-left"
              >
                Logout
              </button>
            : <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="hover:text-coral"
              >
                Register
              </Link>
          }
        </nav>
      )}
    </header>
  );
};

export default Header;
