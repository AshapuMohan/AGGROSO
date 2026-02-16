import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Status from './pages/Status';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* App routes (with sidebar layout) */}
        <Route path="/app" element={<Layout><Home /></Layout>} />
        <Route path="/app/status" element={<Layout><Status /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
