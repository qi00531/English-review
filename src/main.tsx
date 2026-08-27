import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './ui/theme.css';
import { format } from 'date-fns';
import { repository } from './db';
import { migrateLegacyCaptures } from './db/legacy-capture-migration';
import type { LocalDate } from './domain/models';

void migrateLegacyCaptures(repository, format(new Date(), 'yyyy-MM-dd') as LocalDate);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
