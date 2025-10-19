import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Postes from './pages/Postes/Postes';
import Sessions from './pages/Sessions/Sessions';
import Clients from './pages/Clients/Clients';
import Services from './pages/Services/Services';
import Reports from './pages/Reports/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="postes" element={<Postes />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="clients" element={<Clients />} />
          <Route path="services" element={<Services />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;