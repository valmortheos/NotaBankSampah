// Pengelolaan State Aplikasi & Reducer Store

import {
  APP_CONFIG,
  FALLBACK_COMPANY,
  getTodayDateString,
  safeGetStorage,
  safeSetStorage
} from './config.js';

// Load sequence dari storage dengan fallback 1
const getInitialSequence = () => {
  const saved = safeGetStorage('nota_sequence', '1');
  const num = parseInt(saved, 10);
  return isNaN(num) || num < 1 ? 1 : num;
};

// Constructor state awal
export const createInitialState = (existingCompany = null) => ({
  company: existingCompany || FALLBACK_COMPANY,
  sequence: getInitialSequence(),
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

// Reducer pengelolaan state
function reducer(state, action) {
  switch (action.type) {
    case 'SET_COMPANY':
      return { ...state, company: action.value };

    case 'SET_SEQUENCE': {
      const newSeq = Math.max(1, parseInt(action.value, 10) || 1);
      safeSetStorage('nota_sequence', String(newSeq));
      return { ...state, sequence: newSeq };
    }

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

    case 'NEW_NOTE': {
      const nextSeq = state.sequence + 1;
      safeSetStorage('nota_sequence', String(nextSeq));
      return {
        ...createInitialState(state.company),
        sequence: nextSeq
      };
    }

    case 'RESET':
      return createInitialState(state.company);

    default:
      return state;
  }
}

export const store = new Store();
