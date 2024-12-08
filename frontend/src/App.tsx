import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './components/page/Home';
import TravelPlan from './components/page/TravelPlan';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<TravelPlan />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
