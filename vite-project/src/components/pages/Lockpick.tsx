import React from 'react';
import '../styling/Minigames.scss';

const Lockpick: React.FC = () => {
  return (
    <div className="lockpick-container">
      <iframe
        style={{ backgroundColor: 'none', }}
        color-sheme="light"
        src="./lockpick/lockpick.html"
        className="lockpick-iframe"
        title="Lockpick Minigame"
      ></iframe>
    </div>
  );
};

export default Lockpick;
