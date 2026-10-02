// Pengelolaan State Aplikasi & Reducer

import { APP_CONFIG, generateDefaultNotaNo, getTodayDateString } from './config.js';

// Initial State Constructor
export const createInitialState = () => ({
  notaNo: generateDefaultNotaNo(),
  date: getTodayDateString(),
  type: APP_CONFIG.TRANSACTION_TYPES.INCOME,
  items: [...APP_CONFIG.DEFAULT_ITEMS],
  notes: 'Pembayaran tunai. Terima kasih.',
  signatures: {
    sekretaris: true,
    bendahara: true,
    ketua: false
  }
});

class Store {
  constructor() {
    this.state = createInitialState();
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  dispatch(action) {
    this.state = reducer(this.state, action);
    this.notify();
  }
}

// Reducer Sederhana
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'SET_TYPE':
      return { ...state, type: action.value };

    case 'ADD_ITEM':
      return {
        ...state,
        items: [
          ...state.items,
          { id: Date.now(), name: '', qty: 1, price: 0 }
        ]
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.id)
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.id) {
            return { ...item, [action.field]: action.value };
          }
          return item;
        })
      };

    case 'TOGGLE_SIGNATURE':
      return {
        ...state,
        signatures: {
          ...state.signatures,
          [action.key]: action.value
        }
      };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

export const store = new Store();
