import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Rutas from './Rutas.jsx';
import Navbar from './components/NavBar';
import Footer from './components/Footer';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Rutas />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
