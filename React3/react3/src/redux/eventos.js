import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { crearEvento, editarEvento, eliminarEvento } from './actions';

function Eventos() {
  const eventos = useSelector(state => state.eventos);
  const eventoActual = useSelector(state => state.eventoActual);
  const dispatch = useDispatch();
  const [textoEvento, setTextoEvento] = useState('');

  const handleAgregarEvento = () => {
    const nueva = { id: Date.now(), texto: textoEvento };
    if (eventoActual) {
      dispatch(editarEvento(nueva));
    } else {
      dispatch(crearEvento(nueva));
    }
    setTextoEvento('');
    /* dispatch(resetEventoActual()); */
  };

  return (
    <div>
      <h1>Listado de eventos</h1>
      <input type="text" value={textoEvento} onChange={(e) => setTextoEvento(e.target.value)} />
      <button onClick={handleAgregarEvento}>Agregar evento</button>
      <ul>
        {eventos.map(unaEvento => (
          <li key={unaEvento.id}>
            {unaEvento.texto}
            <button onClick={() => dispatch(eliminarEvento(unaEvento.id))}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Eventos;
