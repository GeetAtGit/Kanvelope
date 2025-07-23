// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroImg from '../assets/hero.png';
import PremiumButton from '../components/PremiumButton';
import Footer from '../components/Footer';

import {
  Grid,
   Move, 
  Check,
  Lightbulb,
  PenTool,
  Users,
  Package,
  ArrowLeftCircle,
  ArrowRightCircle,
} from 'lucide-react';

const features = [
  {
    icon: Grid,
    title: 'Create Boards & Cards',
    desc: 'Organize tasks into boards, lists, and cards with ease.',
    bubble: 'Let’s get started!',
  },
  {
    icon: Move,
    title: 'Drag & Drop',
    desc: 'Seamlessly move tasks between stages.',
    bubble: 'Watch me glide!',
  },
  {
    icon: Users,
    title: 'Collaborate',
    desc: 'Invite and assign teammates in seconds.',
    bubble: 'Teamwork makes the dream work!',
  },
];

const storySteps = [
  {
    icon: Lightbulb,
    title: 'Spark of an Idea',
    text: 'It all began with a single thought—what if task management was FUN?',
    bubble: '💡 Eureka!',
  },
  {
    icon: PenTool,
    title: 'Design Magic',
    text: 'We sketched, doodled, and crafted a playful UI that delights.',
    bubble: '✏️ Sketch time!',
  },
  {
    icon: Users,
    title: 'Team & Collaboration',
    text: 'Built for friends, colleagues, and collaborators everywhere.',
    bubble: '🤝 Join the party!',
  },
  {
    icon: Package,
    title: 'Launch Day',
    text: 'Ready to ship your creativity to the world—let’s roll!',
    bubble: '🚀 Blast off!',
  },
];

const testimonials = [
  {
    name: 'Alice Johnson',
    role: 'Project Manager',
    quote:
      'Kanvelope transformed our workflow—dragging tasks between stages is so satisfying!',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Frontend Developer',
    quote:
      'The intuitive UI and smooth animations keep me coming back every day.',
  },
  {
    name: 'Maria Garcia',
    role: 'Designer',
    quote:
      'I love the Premium features—custom board backgrounds and advanced analytics are game-changers.',
  },
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);

  // auto-rotate every 5s
  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cream text-softGreen">
      {/* ——— New Hero Section ——— */}
<section className="relative overflow-hidden bg-gradient-to-br from-softGreen/50 via-yellow-100/40 to-softGreen/70 py-24">
  {/* Decorative “blobs” */}
  <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-ping"></div>
  <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-ping animation-delay-1000"></div>
  <div className="absolute bottom-0 left-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-ping animation-delay-2000"></div>

  <div className="relative container mx-auto px-6 md:px-20 flex flex-col-reverse md:flex-row items-center">
    {/* Left: Text */}
    <div className="w-full md:w-1/2 text-center md:text-left space-y-6 z-10">
      <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent
                     bg-gradient-to-r from-indigo-900 via-blue-700 to-violet-600
                     animate-bounce">
        Turn Your Tasks into <span className="underline decoration-yellow-400">Play</span>
      </h1>
      <p className="text-lg md:text-xl text-softGreen/90">
        Kanvelope makes your workflow a playground—drag, drop, and delight every day.
      </p>
      <div className="flex justify-center md:justify-start gap-4 flex-wrap">
        <Link
          to="/register"
          className="px-6 py-3 bg-yellow-400 text-indigo-900 font-bold rounded-full
                     hover:bg-yellow-400 transform hover:-translate-y-1 transition"
        >
          Get Started Free
        </Link>
        <PremiumButton
          className="px-6 py-3 bg-indigo-900 text-black font-bold rounded-full
                     hover:bg-indigo-700 transform hover:-translate-y-1 transition animate-pulse"
        />
      </div>
    </div>

    {/* Right: Hero Image */}
    <div className="w-full md:w-1/2 z-10">
      <img
        src={HeroImg}
        alt="Kanban board demo"
        className="mx-auto w-full max-w-md animate-bounce-slow"
      />
    </div>
  </div>
</section>
      {/* Our Story */}
      <section id="our story" className="relative py-16 px-6 md:px-20 bg-cream overflow-hidden">
  <h2 className="text-3xl font-bold text-center text-softGreen mb-12">
    Our Story
  </h2>

  <div className="relative max-w-4xl mx-auto">
    {/* central vertical line */}
    <div className="absolute inset-y-0 left-1/2 w-1 bg-softGreen/30 transform -translate-x-1/2"></div>

    {storySteps.map((step, idx) => {
      const Icon = step.icon;
      const isLeft = idx % 2 === 0;
      return (
        <div
          key={idx}
          className={`
            group relative mb-16 flex items-center
            ${isLeft ? 'flex-row-reverse' : 'flex-row'}
          `}
        >
          {/* circle + icon */}
          <div className="relative z-10 flex-shrink-0">
            <div className="w-16 h-16 bg-softGreen text-cream rounded-full flex items-center justify-center
                            animate-pulse group-hover:animate-spin-slow transition">
              <Icon size={32} />
            </div>
            {/* speech bubble */}
            <div className={`
              absolute -top-4 ${isLeft ? 'right-full mr-4' : 'left-full ml-4'}
              bg-softGreen text-cream text-xs px-3 py-1 rounded-full opacity-0
              transition-opacity group-hover:opacity-100
              before:content-[''] before:absolute
              ${isLeft
                ? "before:right-[-6px] before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-l-softGreen"
                : "before:left-[-6px] before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-softGreen"
              }
            `}>
              {step.bubble}
            </div>
          </div>

          {/* content card */}
          <div className={`
            relative z-10 bg-white p-6 rounded-xl shadow-lg max-w-md
            ${isLeft ? 'mr-8 text-right' : 'ml-8 text-left'}
            transition-transform group-hover:scale-105
          `}>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-700">{step.text}</p>
          </div>
        </div>
      );
    })}
  </div>
</section>


      {/* Core Features */}
<section id="features" className="py-16 px-6 md:px-20 bg-cream">
  <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {features.map((f, i) => {
      const Icon = f.icon;
      return (
        <div
          key={i}
          className="relative group bg-white p-6 rounded-xl shadow-md 
                     flex flex-col items-center text-center transition-transform 
                     hover:scale-105"
        >
          {/* icon */}
          <Icon
            size={48}
            className="text-softGreen mb-4 animate-pulse group-hover:animate-bounce"
          />

          {/* speech bubble */}
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 
                       bg-softGreen text-cream text-xs px-3 py-1 rounded-full 
                       opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {f.bubble}
          </div>

          {/* title & desc */}
          <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
          <p className="text-gray-700">{f.desc}</p>
        </div>
      );
    })}
  </div>
</section>

      {/*prcing*/}

      <section id="premium" className="relative py-20 px-6 md:px-20 bg-gradient-to-r from-pink-300 via-yellow-200/50 to-pink-300 overflow-hidden">
  {/* subtle animated background overlay */}
  <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-pink-400 via-pink-200 to-yellow-200/50 animate-pulse"></div>

  <div className="relative z-10 max-w-4xl mx-auto text-center">
    {/* Headline */}
    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-bounce">
      Upgrade to <span className="text-yellow-300">Premium</span>
    </h2>
    <p className="text-lg text-white mb-8">
      Unlock exclusive tools & turbo-charge your workflow!
    </p>

    {/* Floating Pricing Card */}
    <div className="inline-block bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-8 mb-8 transform transition hover:scale-105">
      <div className="flex justify-center items-baseline mb-4">
        <span className="text-6xl font-extrabold text-black">₹499</span>
        <span className="text-black text-xl ml-2">/ year</span>
      </div>
      <ul className="text-black space-y-3">
        {[
          'Custom Backgrounds & Themes',
          'Advanced Analytics & Reports',
          'Priority Support',
          'Team Collaboration Tools',
        ].map((feat, i) => (
          <li
            key={i}
            className={`flex items-center gap-2 ${
              i % 2 === 0 ? 'animate-bounce' : 'animate-pulse'
            }`}
          >
            <Check className="text-green-300" size={20} />
            <span className="font-medium">{feat}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Call-to-Action */}
    <div className="mb-4">
      <PremiumButton
        className="bg-pink-300 text-white font-bold px-6 py-3 rounded-full 
                   hover:bg-green-800 transform hover:-translate-y-1 animate-pulse"
      />
    </div>
    <p className="text-sm text-yellow-100 italic">
      30-day money-back guarantee • Cancel anytime
    </p>
  </div>
</section>

      {/* ——— Testimonial Carousel ——— */}
<section id="testimonials" className="py-16 px-6 md:px-20 bg-cream">
  <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>

  <div className="relative max-w-3xl mx-auto">
    {/* Sliding track */}
    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{ transform: `translateX(-${current * 100}%)` }}
    >
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="w-full flex-shrink-0 px-4 md:px-6 lg:px-8"
        >
          <div className="bg-white p-8 rounded-xl shadow-lg h-full flex flex-col justify-between">
            <p className="italic text-gray-700 mb-6">“{t.quote}”</p>
            <div>
              <p className="font-semibold text-gray-900">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Prev / Next Buttons */}
    <button
      onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
      className="absolute left-0 top-1/2 -translate-y-1/2 bg-softGreen/50 hover:bg-softGreen text-white p-2 rounded-full"
    >
      <ArrowLeftCircle size={28} />
    </button>
    <button
      onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
      className="absolute right-0 top-1/2 -translate-y-1/2 bg-softGreen/50 hover:bg-softGreen text-white p-2 rounded-full"
    >
      <ArrowRightCircle size={28} />
    </button>

    {/* Dots */}
    <div className="flex justify-center gap-2 mt-6">
      {testimonials.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrent(i)}
          className={`
            w-3 h-3 rounded-full transition
            ${i === current ? 'bg-softGreen' : 'bg-softGreen/30 hover:bg-softGreen/60'}
          `}
        />
      ))}
    </div>
  </div>
</section>

      {/* Footer */}
      <Footer />
      
    </div>
  );
}
