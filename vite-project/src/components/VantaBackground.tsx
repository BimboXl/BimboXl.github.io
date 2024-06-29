// src/components/VantaBackground.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CELLS from 'vanta/dist/vanta.cells.min';

const VantaBackground = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    const vantaEffect = CELLS({
      el: vantaRef.current,
      color1: '#2a5c2a',
      color2: '#4da44d',
      mouseControls: true,
      touchControls: true,
      gyroControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      size: 1.00,
      speed: 2.00,
      THREE: THREE // Pass in the imported THREE object
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1000
      }}
    ></div>
  );
};

export default VantaBackground;
