export const CREAR_EVENTO = 'CREAR_EVENTO';
export const EDITAR_EVENTO = 'EDITAR_EVENTO';
export const ELIMINAR_EVENTO = 'ELIMINAR_EVENTO';

export const crearEvento = (evento) => ({
  type: CREAR_EVENTO,
  payload: evento,
});

export const editarEvento = (evento) => ({
    type: EDITAR_EVENTO,
    payload: evento,
});

export const eliminarEvento = (eventoId) => ({
  type: ELIMINAR_EVENTO,
  payload: eventoId,
});
