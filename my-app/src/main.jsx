import React from 'react';
import { createRoot } from 'react-dom/client'; 
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);