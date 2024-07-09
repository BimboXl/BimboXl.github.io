import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VantaBackground from './VantaBackground';
import './App.scss';
import Header from './pages/Header';
import Home from './pages/Home';
import Minigames from './pages/Minigames';
import Lockpick from './pages/Lockpick';
import SecBypass from './pages/boosting'

function App() {
  return (
    <Router>
      <div className='App-wrapper'>
        <VantaBackground />
        <Header />
        <Routes>
          <Route path="/lockpick" element={<Lockpick />} />
          <Route path="/boosting" element={<SecBypass />} />
          <Route path="/minigames" element={<Minigames />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
