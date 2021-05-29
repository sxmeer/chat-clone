import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StateProvider } from './components/providers/StateProvider';
import reducer, { initialState } from './components/providers/reducer';

const app = <React.StrictMode>
  <BrowserRouter>
    <StateProvider
      initialState={initialState}
      reducer={reducer}>
      <App />
    </StateProvider>
  </BrowserRouter>
</React.StrictMode>;

ReactDOM.render(app, document.getElementById('root'));