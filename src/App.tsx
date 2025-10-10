import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import JobDetail from './components/JobDetail';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lowongan/:id" element={<JobDetail />} />
        </Routes>
      </Router>
  );
}

export default App;