import React from 'react';
import Header from './pages/Header';
import Projects from './pages/Projects';
import './App.scss';
import { animate } from 'motion';

animate

const App: React.FC = () => {
  return (
    <div className="App-wrapper">
      <Header />
      <main>
        <Projects />
      </main>
    </div>
  );
}

export default App;