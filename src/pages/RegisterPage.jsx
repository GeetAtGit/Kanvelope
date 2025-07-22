// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { auth, db } from '../config/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), {
        email: res.user.email,
        createdAt: new Date(),
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lightPink to-cream px-4">
      <div className="w-full max-w-md bg-cream p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-softGreen text-center mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-softGreen mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-softGreen"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-softGreen mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-softGreen"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-softGreen hover:bg-coral text-cream font-medium rounded-lg transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-softGreen mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:text-coral">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
