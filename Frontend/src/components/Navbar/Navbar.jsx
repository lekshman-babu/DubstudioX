import React, { useState } from 'react';
import './Navbar.css';
import '../Main/MainContainer.css';
import AboutUs from '../AboutUs/About';

function Navbar({aboutus}) {
  
  const handleAboutUs = () => {
    aboutus(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div id="navbar-heading">DUBSTUDIO X</div>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="" className="nav-link">
                  Content Platforms
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link" onClick={handleAboutUs}>
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;