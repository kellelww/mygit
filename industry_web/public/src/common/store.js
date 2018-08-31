
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagas from '../sagas/index';
import reducers from '../reducers/index';

const configurStore = (rootReducer, rootSaga) => {
  const middleware = [];
  const enhancers = [];
  const sagaMiddleWare = createSagaMiddleware();

  middleware.push(sagaMiddleWare);

  enhancers.push(applyMiddleware(...middleware));

  if (window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }

  const store = createStore(rootReducer, compose(...enhancers));

  sagaMiddleWare.run(rootSaga);

  return store;
};

export const store = configurStore(reducers, sagas);
