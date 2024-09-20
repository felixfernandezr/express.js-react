import { CREAR_EVENTO, EDITAR_EVENTO, ELIMINAR_EVENTO } from './actions';

const estadoInicial = {
  eventos: [],
  eventoActual: null,
};

const eventosReducer = (state = estadoInicial, action) => {
  switch (action.type) {
    case CREAR_EVENTO:
      return {
        ...state,
        eventos: [...state.eventos, action.payload],
      };
    case ELIMINAR_EVENTO:
      return {
        ...state,
        eventos: state.eventos.filter(task => task.id !== action.payload),
      };
    case EDITAR_EVENTO: {
        const eventoIndex = state.eventos.findIndex((evento) => evento.id === action.payload.id);
        if (eventoIndex !== -1) {
            state.eventos[eventoIndex] = action.payload;
        }
        return state;
    }
    default:
      return state;
  }
};

export default eventosReducer;
