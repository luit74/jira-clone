// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import Home from "./pages/Home";

import Backlog from "./components/Backlog";
import Layout from "./layout/layout";
import CompletedTask from "./pages/CompletedTask";
import AssignedTasks from "./pages/AssignedTask";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Layout Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="backlog" element={<Backlog />} />
            <Route path="complete-task" element={<CompletedTask />} />
            <Route path="/assigned" element={<AssignedTasks />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
