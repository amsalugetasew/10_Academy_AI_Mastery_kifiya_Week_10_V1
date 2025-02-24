import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OilPricePredictor from "./pages/OilPricePredictor";
import Dashboard from "./pages/Dashboard";
import MLProjects from "./pages/MLProjects";
import "./App.css"; // Import CSS file

const Header = () => (
  <header className="header">
    <h1>Machine Learning Dashboard</h1>
  </header>
);

const Sidebar = () => (
  <div className="sidebar">
    <h2>ML App</h2>
    <ul>
      <li><Link to="/">Dashboard</Link></li>
      <li><Link to="/predictor">Oil Price Predictor</Link></li>
      <li><Link to="/projects">ML Projects</Link></li>
    </ul>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <p>&copy; {new Date().getFullYear()} ML Dashboard | All Rights Reserved</p>
  </footer>
);

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-container">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/predictor" element={<OilPricePredictor />} />
              <Route path="/projects" element={<MLProjects />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
