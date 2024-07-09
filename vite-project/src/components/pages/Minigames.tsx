import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Minigames.scss';

const Minigames: React.FC = () => {
  return (
    <div className="minigames">
      <h2>Select a Minigame</h2>
      <div className="minigame-boxes">
        <Link to="/lockpick" className="minigame-box">
          <div>Lockpick Minigame</div>
        </Link>
        <Link to="/boosting" className="minigame-box">
          <div>Boosting Minigame</div>
        </Link>
        {/* Add more minigame links here */}
      </div>
    </div>
  );
};

export default Minigames;
