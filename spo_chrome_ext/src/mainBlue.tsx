import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppBlue from './AppBlue.tsx';
import './indexBlue.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBlue/>
  </StrictMode>
);
