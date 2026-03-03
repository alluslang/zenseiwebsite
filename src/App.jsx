import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import AboutUs from './components/AboutUs';
import PromoBanner from './components/PromoBanner';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for visual effect (min 2s)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fullscreen-loader">
          <img src="/zlogo_white.svg" alt="Zensei Loading..." className="loader-logo" />
        </div>
      )}
      <PromoBanner isBannerVisible={isBannerVisible} setIsBannerVisible={setIsBannerVisible} />
      <Navbar />
      <main>
        <Hero />
        <Products />
        <AboutUs />
      </main>
    </>
  );
}

export default App;
