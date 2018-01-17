import React from 'react';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import rootSaga from './sagas';



import { combineReducers, createStore, applyMiddleware  } from 'redux';

import * as reducers from './reducers';


const sagaMiddleware = createSagaMiddleware();
let reducer = combineReducers(reducers);
let store = createStore(reducer, applyMiddleware(sagaMiddleware));


sagaMiddleware.run(rootSaga);


ReactDOM.render( < Provider store = { store } >
    <App />
    </Provider>, 
    document.getElementById('root'));
 registerServiceWorker();