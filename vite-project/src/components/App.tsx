import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.scss';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <Router>
      <div className="website-wrapper">
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
