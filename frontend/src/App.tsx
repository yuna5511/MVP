import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './components/page/Home';
import TravelPlan from './components/page/TravelPlan';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<TravelPlan />} />
      </Routes>
    </Router>
  );
};

export default App;
