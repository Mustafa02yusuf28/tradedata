'use client';

import { useEffect } from 'react';

export default function BackgroundParticles() {
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const startX = Math.random() * window.innerWidth;
        const delay = Math.random() * 20;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = startX + 'px';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        container.appendChild(particle);
      }
    };

    createParticles();

    // Cleanup function
    return () => {
      const container = document.getElementById('particles');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div className="bg-particles" id="particles"></div>;
} 