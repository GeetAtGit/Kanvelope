// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import HeroImg from '../assets/hero.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="w-full px-4 sm:px-20 lg:px-12 pt-8 - pb-2  flex flex-col-reverse md:flex-row 
        items-center gap-10 bg-cream">
          {/* Left: Image */}
          <div className="w-full md:w-1/2">
            <img
              src={HeroImg}
              alt="Kanban board demo"
              className=" relative -top-18 w-full h-auto "
            />
          </div>

          {/* Right: Text & CTA */}
          <div className="w-full md:w-1/2 text-center md:text-left ">
            <h2 className="text-4xl font-extrabold mb-4 text-softGreen">
              Manage Your Tasks with Kanvelope
            </h2>
            <p className="text-softGreen mb-8 px-4">
              A simple and intuitive Kanban board to streamline your workflow.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-pink-200 text-cream
               rounded-lg text-lg font-medium hover:bg-coral transition"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold text-softGreen mb-6 text-center">
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2 text-softGreen">
                Create Boards & Cards
              </h4>
              <p className="text-softGreen">
                Organize your tasks in boards, lists, and cards.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2 text-softGreen">
                Drag &amp; Drop
              </h4>
              <p className="text-softGreen">
                Easily move tasks between stages.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2 text-softGreen">
                Collaborate
              </h4>
              <p className="text-softGreen">
                Share boards with team members and assign tasks.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-softGreen">
        <div className="container mx-auto px-6 py-4 text-center text-cream">
          © {new Date().getFullYear()} Kanvelope. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
