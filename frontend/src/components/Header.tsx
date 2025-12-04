import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-gupjob-primary.png';

export default function Header() {
  return (
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
  );
}