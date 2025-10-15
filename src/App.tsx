import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import JobDetail from './components/JobDetail';
import Maintenance from './components/Maintentance';

function App() {
  // Set to true untuk mengaktifkan maintenance mode
  // Set to false untuk menonaktifkan maintenance mode
  const UNDER_MAINTENANCE = true;

  if (UNDER_MAINTENANCE) {
    return <Maintenance />;
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