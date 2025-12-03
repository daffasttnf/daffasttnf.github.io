import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import JobDetail from './components/JobDetail';

function App() {
  // Set to true untuk mengaktifkan maintenance mode
  // Set to false untuk menonaktifkan maintenance mode
  const UNDER_MAINTENANCE = false;

  if (UNDER_MAINTENANCE) {
    return
    // <Timeline />;
  }

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