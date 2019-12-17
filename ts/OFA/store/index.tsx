import { combineReducers, createStore } from 'redux';
import { companyInfoReducer } from './companyInfo/reducers';
import { ticketReducer } from './tickets/reducers';
import { getInitialState, subscribePersister} from './persist';

const rootReducer = combineReducers({
  tickets: ticketReducer,
  companyInfo: companyInfoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const storeInstance = createStore(rootReducer, getInitialState());

subscribePersister(storeInstance);
