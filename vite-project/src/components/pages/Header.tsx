import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Header.scss';

const Header: React.FC = () => {
  return (
    <header className='header'>
      <nav className='header-pages'>
        <Link to="/">home</Link>
        <Link to="/minigames">minigames</Link>
        <Link to="/info">info</Link>
      </nav>
    </header>
  );
};

export default Header;
