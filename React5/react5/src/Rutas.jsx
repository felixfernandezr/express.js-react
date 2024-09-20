import { Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Resume from './components/Resume'
import Projects from './components/Projects';
import Contact from './components/Contact'


function Rutas () {
  return (
    <Routes>
      <Route path="/" element={ <Index /> } />
      <Route path="/resume.html" element={ <Resume /> } />
      <Route path="/projects.html" element={ <Projects /> } />
      <Route path="/contact.html" element={ <Contact /> } />
    </Routes>
  );
}

export default Rutas;