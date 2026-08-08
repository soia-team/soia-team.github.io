import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './open-design.css';
import './sub-pages.css';
import './react-app.css';
import './upstream/app/community.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
