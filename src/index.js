import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Home from './module/home/component/home';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'react-progress-2/main.css';
import fetchHelper from './helper/FetchHelper';
import Progress from 'react-progress-2';

export const configure = configureStore();
fetchHelper.addBeforeRequestInterceptor(() => Progress.show());
fetchHelper.addAfterResonseInterceptor(() => Progress.hide());
ReactDOM.render(
  <Provider store={configure.store}>
    <ToastContainer position="top-left" hideProgressBar autoClose={1000} />
    <Home />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
