import React from 'react';
import '../styling/Header.scss';

const Header: React.FC = () => {
  return (
    <header className='header'>
      <div className='header-icon'>
          {/* <img src='./icon.pngd' alt='Icon' /> */}
          <span className='header-name'>Jorden Alexander</span>
        </div>
        <nav className='header-pages'>
          <a href='#work'>work</a>
          <a href='#services'>services</a>
          <a href='#aboutme'>about me</a>
        </nav>
        <button className='contact-button'>Contact Now</button>
    </header>
  );
}

export default Header;
