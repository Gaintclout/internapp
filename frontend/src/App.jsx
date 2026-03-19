import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import MentorLogin from "./pages/MentorLogin";
import Preferences from "./pages/Preferences";
import Forgotpassword from "./pages/Forgotpassword";
import Send from "./pages/Send";
import Payment from "./pages/Payment";
import Project from "./pages/Project";
import Task from "./pages/Task";
import Reports from "./pages/Reports";
import Certificate from "./pages/Certificate";
import Spamshield from "./pages/Spamshield";
import Hiresense from "./pages/Hiresense";
import IdentiQ from "./pages/IdentiQ";
import InternDashboard from "./pages/InternDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectManagement from "./pages/ProjectManagement";
import PaymentReport from "./pages/PaymentReport";
import Mentor from "./pages/Mentor";
import Setting from "./pages/Setting";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import Newpassword from "./pages/Newpassword";
import Fastrack from "./pages/Fastrack";
import FortyFiveDays from "./pages/FortyFiveDays";
import FourMonths from "./pages/FourMonths";
import StudentTasks from "./pages/StudentTasks";
import TaskDetails from "./pages/TaskDetails";
import SubmissionHistory from "./pages/SubmissionHistory";
import TaskListPage from "./pages/TaskListPage";
import TermsAndConditions from "./pages/TermsAndConditions";

// 🔐 PROTECTED ROUTE WRAPPER
function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("student_token");

  return token ? children : <Navigate to="/studentlogin" />;
}

// 🔐 ADMIN PROTECTED
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return token && user.role === "admin"
    ? children
    : <Navigate to="/adminlogin" />;
}

export default function App() {
  return (
    <Router>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/studentlogin" element={<StudentLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/Mentorlogin" element={<MentorLogin />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/send" element={<Send />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

          {/* USER FLOW */}
          <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/project" element={<ProtectedRoute><Project /></ProtectedRoute>} />
          <Route path="/task" element={<ProtectedRoute><Task /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />

          {/* PROJECTS */}
          <Route path="/spamshield" element={<ProtectedRoute><Spamshield /></ProtectedRoute>} />
          <Route path="/hiresense" element={<ProtectedRoute><Hiresense /></ProtectedRoute>} />
          <Route path="/identiq" element={<ProtectedRoute><IdentiQ /></ProtectedRoute>} />

          {/* INTERNSHIP TYPES */}
          <Route path="/fastrack" element={<ProtectedRoute><Fastrack /></ProtectedRoute>} />
          <Route path="/fortyfivedays" element={<ProtectedRoute><FortyFiveDays /></ProtectedRoute>} />
          <Route path="/fourmonths" element={<ProtectedRoute><FourMonths /></ProtectedRoute>} />

          {/* TASK SYSTEM */}
          <Route path="/tasks" element={<ProtectedRoute><TaskListPage /></ProtectedRoute>} />
          <Route path="/taskdetails/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
          <Route path="/studenttasks" element={<ProtectedRoute><StudentTasks /></ProtectedRoute>} />
          <Route path="/submissionhistory" element={<ProtectedRoute><SubmissionHistory /></ProtectedRoute>} />

          {/* DASHBOARDS */}
          <Route path="/interndashboard" element={<ProtectedRoute><InternDashboard /></ProtectedRoute>} />

          {/* ADMIN */}
          <Route path="/admindashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/projectManagement" element={<AdminRoute><ProjectManagement /></AdminRoute>} />
          <Route path="/paymentreport" element={<AdminRoute><PaymentReport /></AdminRoute>} />
          <Route path="/mentor" element={<AdminRoute><Mentor /></AdminRoute>} />
          <Route path="/setting" element={<AdminRoute><Setting /></AdminRoute>} />

        </Routes>

      </main>
    </Router>
  );
}