import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmployeesList from './components/EmployeesList';
import EmployeeDetails from './components/EmployeeDetails';
import './index.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<EmployeesList />} />
          <Route path="/employees/:employeeId/details" element={<EmployeeDetails />} />
          <Route path="*" element={<div> 404 Not found </div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;