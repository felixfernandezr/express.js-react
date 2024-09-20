import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store'; // Import your Redux store
import Eventos from './redux/eventos';
import Formulario from './components/Formulario'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Sistema de gestión de eventos</h1>
        <Eventos />
        <Formulario />
      </div>
    </Provider>
  );
}

export default App;
