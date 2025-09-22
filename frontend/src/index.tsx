import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import { StaticLogin } from './interviewPrepTasks/ReactQuestions/SinglePageApps/StaticLogin/StaticLogin';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<App />}
        />
        <Route
          path='/login'
          element={<StaticLogin />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
