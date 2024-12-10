import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './components/page/Home';
import TravelPlan from './components/page/TravelPlan';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<TravelPlan />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
