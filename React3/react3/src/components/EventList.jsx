import React from 'react'

function EventList({ eventos, onEditar, onBorrar }) {
    return (
      <ul>
        {eventos.map((evento) => (
          <li key={evento.id}>
            <h2>{evento.nombre}</h2>
            <p>{evento.lugar}</p>
            <p>{evento.fecha.toLocaleDateString()}</p>
            <p>{evento.organizador}</p>
            <p>{evento.contacto}</p>
            <button onClick={() => onEditar(evento)}>Editar</button>
            <button onClick={() => onBorrar(evento.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    );
  }

export default EventList