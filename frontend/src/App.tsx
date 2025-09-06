import React, { useEffect,useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmailDetail from "./pages/EmailDetails";
import Login from "./pages/Login";
// import ProtectedRoute from "./components/ProtectedRoute";
import ManageCategories from "./pages/Manage-Categories";
const App: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
    // Get logged-in user
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:5000/auth/me", {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            setUserId(data.id);
            console.log("User ID:", data.id);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/email/:id"
          element={
            // <ProtectedRoute>
              <EmailDetail />
            // </ProtectedRoute>
          }
        />
        <Route path="/manage-categories" element={<ManageCategories userId={userId} />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
