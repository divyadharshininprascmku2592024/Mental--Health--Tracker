import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import SleepTracker from './pages/SleepTracker';
import Activities from './pages/Activities';
import Reports from './pages/Reports';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="main-wrapper">
          <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/moods" element={<MoodTracker />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/sleep" element={<SleepTracker />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
