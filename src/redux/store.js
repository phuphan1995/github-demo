import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import { dispatcherMiddleware } from 'redux-dispatcher';
import rootReducer from './reducer';
import fetchHelper from '../helper/FetchHelper';
import Api from '../helper/Api';

export default function configureStore() {
  let middlewares = [
    dispatcherMiddleware.withContext({
      Api,
      fetchHelper,
    }),
  ];
  process.env.NODE_ENV === 'development' && middlewares.push(logger);
  let store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
  return { store };
}
