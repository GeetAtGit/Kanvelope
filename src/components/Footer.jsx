// src/components/Footer.jsx
import React from 'react';
import { Mail, Phone, Twitter, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const links = [
  { name: 'Home',       to: '/blog' },
  { name: 'Features',   to: '#features',   isAnchor: true },
  { name: 'Premium',    to: '#premium',    isAnchor: true },
  { name: 'Testimonial',to: '#testimonials',isAnchor: true },
  { name: 'Our Story',  to: '#our story',   isAnchor: true  },
];
  const socials = [
    { icon: <Github size={20} />, href: 'https://github.com/geetatgit/kanvelope' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com/in/gitanjali-kumari-maybe' },
  ];

  return (
    <footer className="bg-softGreen text-cream py-12 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Tagline */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Kanvelope</h3>
          <p className="text-sm opacity-90">
            Where <span className="font-semibold">work</span> meets <span className="font-semibold">play</span>.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
  {links.map((l) => (
    <li key={l.name}>
      {l.isAnchor ? (
        <a href={l.to} className="hover:text-yellow-300 transition-colors">
          {l.name}
        </a>
      ) : (
        <Link to={l.to} className="hover:text-yellow-300 transition-colors">
          {l.name}
        </Link>
      )}
    </li>
  ))}
</ul>

        </div>

        {/* Contact & Social */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">Contact Us</h4>
          <div className="flex items-center gap-2">
            <Mail size={18} /> 
            <a href="mailto:support@kanvelope.com" className="hover:text-yellow-300 transition">
              support@kanvelope.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} /> 
            <a href="tel:+911234567890" className="hover:text-yellow-300 transition">
              +91 12345 67890
            </a>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-300 transition transform hover:-translate-y-1"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-cream/50 my-8" />

      {/* Copyright */}
      <p className="text-center text-sm opacity-80">
        © {year} Kanvelope. All rights reserved.
      </p>
    </footer>
  );
}
