import React from 'react';
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <h4>GUPJOB</h4>
          <p>Connecting learners with opportunities.</p>
        </div>
        <div>
          <h4>Product</h4>
          <ul>
            <li>Roadmaps</li>
            <li>Mentorship</li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li>About</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {new Date().getFullYear()} GUPJOB. All rights reserved.</div>
      </div>
    </footer>
  );
}