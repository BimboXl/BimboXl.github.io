import React, { useEffect } from 'react';
import '../styling/Header.scss';
import { animate, inView, spring } from 'motion';

const Header: React.FC = () => {
  useEffect(() => {
    inView('.header', () => {
      animate('.header', 
        { 
          opacity: [0, 1], 
          translate: ['-60px', '0px'], 
          width: ['40%', '90%'] 
        }, 
        {
          duration: 2.0,
          easing: spring({ stiffness: 20, damping: 20 })
        }
      );
    });
  }, []);

  return (
    <header className="header">
      <div className="header-icon">My Portfolio</div>
      <nav className="header-pages">
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
