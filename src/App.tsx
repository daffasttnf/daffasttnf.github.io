import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import JobDetail from './components/JobDetail';
import SavedJobsPage from './components/SavedJobsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lowongan/:id" element={<JobDetail />} />
        <Route path="/tersimpan" element={<SavedJobsPage />} />
      </Routes>
    </Router>
  );
}

export default App;