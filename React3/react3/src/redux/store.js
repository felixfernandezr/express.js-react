import { createStore } from 'redux';
import eventosReducer from './reducers';

const store = createStore(eventosReducer);

export default store;