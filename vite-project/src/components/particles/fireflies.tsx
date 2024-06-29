import React, { useRef, useEffect } from 'react';

const Fireflies: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fireflies: Firefly[] = [];
  let w = window.innerWidth;
  let h = window.innerHeight;

  class Firefly {
    x: number;
    y: number;
    s: number;
    ang: number;
    v: number;

    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.s = Math.random() * 2;
      this.ang = Math.random() * 2 * Math.PI;
      this.v = (this.s * this.s) / 4;
    }

    move() {
      this.x += this.v * Math.cos(this.ang);
      this.y += this.v * Math.sin(this.ang);
      this.ang += Math.random() * 20 * (Math.PI / 180) - 10 * (Math.PI / 180);
    }

    show() {
      if (ctxRef.current) {
        ctxRef.current.beginPath();
        ctxRef.current.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
    
        // Set shadow properties
        ctxRef.current.shadowColor = '#fff';
        ctxRef.current.shadowBlur = 5;
    
        // You can set fillStyle to the color of the circle
        ctxRef.current.fillStyle = '#fff'; // or any color you prefer
    
        // Draw the circle with shadow
        ctxRef.current.fill();
      }
    }    
  }

  const draw = () => {
    if (fireflies.length < 100) {
      for (let j = 0; j < 10; j++) {
        fireflies.push(new Firefly());
      }
    }

    // Animation
    for (let i = 0; i < fireflies.length; i++) {
      fireflies[i].move();
      fireflies[i].show();
      if (fireflies[i].x < 0 || fireflies[i].x > w || fireflies[i].y < 0 || fireflies[i].y > h) {
        fireflies.splice(i, 1);
      }
    }
  };

  const initCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      ctxRef.current = canvas.getContext('2d');
      if (ctxRef.current) {
        canvas.width = w;
        canvas.height = h;
        ctxRef.current.fillStyle = 'rgba(30,30,30,1)';
        ctxRef.current.fillRect(0, 0, w, h);
      }
    }
  };

  useEffect(() => {
    initCanvas();
    const loop = () => {
      requestAnimationFrame(loop);
      if (ctxRef.current) {
        ctxRef.current.clearRect(0, 0, w, h);
        draw();
      }
    };
    loop();

    window.addEventListener('resize', () => {
      w = window.innerWidth;
      h = window.innerHeight;
      if (canvasRef.current) {
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        initCanvas();
      }
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return <canvas ref={canvasRef} style={{ filter: 'blur(1px)' }} />;
};

export default Fireflies;
