import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../styles/styles.css';

// --- Assets Imports ---
import logo from '../assets/images/logo-gupjob-primary.png';
import hero from '../assets/images/img-landing-hero.png';

// Feature Icons (ensure these exist in frontend/src/assets/images)
import iconRoadmaps from '../assets/images/icon-interactive-roadmaps.png';
import iconSkills from '../assets/images/icon-verified-skills.png';
import iconMentorship from '../assets/images/icon-expert-mentorship.png';
import iconHiring from '../assets/images/icon-data-driven-hiring.png';
import iconProjects from '../assets/images/icon-real-projects.png';
import iconCohort from '../assets/images/icon-cohort-tracking.png';

export default function Landing() {
  return (
    <div>
      <header className="site-header container">
        <div className="brand">
          <Link to="/"><img src={logo} alt="GUPJOB" className="brand-logo" /></Link>
        </div>
        <nav className="site-nav">
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How it Works</Link>
          <Link to="/companies">For Companies</Link>
          <Link to="/login" className="btn btn--ghost">Sign in</Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero container">
          <div className="hero-left">
            <h1>Bridge the gap between learning and hiring</h1>
            <p className="lead">
              Master real-world skills through structured learning paths, get mentored by industry experts,
              and land opportunities with leading companies.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn--primary">Start Learning (Free)</Link>
              <Link to="/companies" className="btn btn--ghost">Find Top Talent</Link>
            </div>

            <ul className="kpis">
              <li><strong>50K+</strong><span> Learners</span></li>
              <li><strong>500+</strong><span> Verified Skills</span></li>
              <li><strong>200+</strong><span> Companies</span></li>
            </ul>
          </div>

          <div className="hero-right">
            <img src={hero} alt="GUPJOB Platform Preview" className="hero-image" />
          </div>
        </section>

        {/* Features Section */}
        <section className="container features">
          <h2 className="section-title">Why Choose GUPJOB?</h2>

          <div className="features-grid">
            <article className="feature-card">
              <img src={iconRoadmaps} alt="Interactive Roadmaps" className="feature-icon" />
              <h3>Interactive Roadmaps</h3>
              <p>Follow structured learning paths with visual DAG representation. See prerequisites, track progress, and unlock new skills.</p>
            </article>

            <article className="feature-card">
              <img src={iconSkills} alt="Verified Skills" className="feature-icon" />
              <h3>Verified Skills</h3>
              <p>Submit real projects for verification. Get reviewed by industry mentors and earn blockchain-backed skill badges.</p>
            </article>

            <article className="feature-card">
              <img src={iconMentorship} alt="Expert Mentorship" className="feature-icon" />
              <h3>Expert Mentorship</h3>
              <p>Connect with engineers from top companies. Book 1-on-1 sessions, get code reviews, and receive career guidance.</p>
            </article>

            <article className="feature-card">
              <img src={iconHiring} alt="Data Driven Hiring" className="feature-icon" />
              <h3>Data-Driven Hiring</h3>
              <p>Companies find talent based on verified skills, not keywords. See actual project work and roadmap completion.</p>
            </article>

            <article className="feature-card">
              <img src={iconProjects} alt="Real Projects" className="feature-icon" />
              <h3>Real Projects</h3>
              <p>Learn by building. Every skill requires a real project submission, ensuring practical, hands-on experience.</p>
            </article>

            <article className="feature-card">
              <img src={iconCohort} alt="Cohort Tracking" className="feature-icon" />
              <h3>Cohort Tracking</h3>
              <p>Companies can track internship cohorts with real-time progress matrices. See who’s excelling and who needs support.</p>
            </article>
          </div>
        </section>

        {/* CTA band */}
        <section className="cta-band">
          <div className="container cta-inner">
            <div>
              <h3>Ready to bridge the gap?</h3>
              <p>Join thousands of learners transforming their careers today.</p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn btn--white">Start Learning Now</Link>
              <Link to="/contact" className="btn btn--ghost">Schedule a Demo</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Use the shared Footer component so footer style/behavior is consistent */}
      <Footer />
    </div>
  );
}