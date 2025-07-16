import React from 'react';
import './components/Main/MainContainer.css';
import './App.css';
import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Form from './components/Form/Form';
import BottomPane from './components/BottomPane/BottomPane';
import AboutUs from './components/AboutUs/About';

function App() {
  const [showAboutUs, setShowAboutUs] = useState(false);
  const handleAboutUsClick = () => {
    setShowAboutUs(!showAboutUs);
  };
  console.log(showAboutUs);
  return (
    <div id="main-container">
      {showAboutUs ? (
        <AboutUs/>
      ) : (
        <>
          <Navbar aboutus={handleAboutUsClick} />
          <div className="adj">
            <Hero />
          </div>
          <Form />
          <div className="adj">
            <BottomPane />
          </div>
        </>
      )}
    </div>
  );
}

export default App;