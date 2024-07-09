import React from 'react';
import '../styling/Minigames.scss';

const Lockpick: React.FC = () => {
  return (
    <div className="lockpick-container">
      <iframe
        src="src\components\pages\lockpick\lockpick.html"
        className="lockpick-iframe"
        title="Lockpick Minigame"
      />
    </div>
  );
};

export default Lockpick;
