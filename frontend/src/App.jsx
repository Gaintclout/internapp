import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ All page imports
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import MentorLogin from "./pages/MentorLogin";
import Preferences from "./pages/Preferences";
import Forgotpassword from "./pages/Forgotpassword";
import Send from "./pages/Send";
import Payment from "./pages/Payment";
import Project from "./pages/Project";
import Project1 from "./pages/Project1";
import Task from "./pages/Task";
import Reports from "./pages/Reports";
import Certificate from "./pages/Certificate";
import Movie from "./pages/Movie";
import Media from "./pages/Media";
import ChatbotF from "./pages/ChatbotF";
import ChatbotFlask from "./pages/ChatbotFlask";
import Fakenews from "./pages/Fakenews";
import Cogniflow from "./pages/Cogniflow";
import Spamshield from "./pages/Spamshield";
import Hiresense from "./pages/Hiresense";
import IdentiQ from "./pages/IdentiQ";
import InternDashboard from "./pages/InternDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProjectManagement from "./pages/ProjectManagement";
import PaymentReport from "./pages/PaymentReport";
import Mentor from "./pages/Mentor";
import Setting from "./pages/Setting";
import MentorDashboard from "./pages/MentorDashboard";
import InternDashboardTask from"./pages/InternDashboardTask";
import InternDashboardCertificate from "./pages/InternDashboardCertificate"
import InternLogout from"./pages/InternLogout";
import StudentLogin from"./pages/StudentLogin";
import AdminLogin from"./pages/AdminLogin";
import InternDashboardReport from"./pages/InternDashboardReport";
import AdminDashboardUser from"./pages/AdmindashboardUser";
import Newpassword from"./pages/Newpassword";
import Fastrack from "./pages/Fastrack";
import FortyFiveDays from "./pages/FortyFiveDays";
import FourMonths from "./pages/FourMonths";
// import VscodePathSetup from "./components/VscodePathSetup.jsx";
import StudentTasks from "./pages/StudentTasks";
import TaskDetails from "./pages/TaskDetails";
import SubmissionHistory from "./pages/SubmissionHistory";
import TaskCard from "./components/TaskCard.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import StatusBadge from "./components/StatusBadge.jsx";
import CodeEditorBox from "./components/CodeEditorBox.jsx";
import LockedBanner from "./components/LockedBanner.jsx";
import TaskListPage from "./pages/TaskListPage.jsx";
import TermsAndConditions from "./pages/TermsAndConditions";



export default function App() {


// **inspect code** //

//     useEffect(() => {
//   const disableRightClick = (e) => e.preventDefault();

//   const disableKeys = (e) => {
//     const key = e.key.toLowerCase();

//     if (
//       e.key === "F12" ||
//       e.key === "F2" ||
//       (e.ctrlKey && e.shiftKey && ["i", "j", "c", "k", "e"].includes(key)) ||
//       (e.ctrlKey && ["u", "s", "p"].includes(key))
//     ) {
//       e.preventDefault();
//       e.stopPropagation();
//       return false;
//     }
//   };

//   document.addEventListener("contextmenu", disableRightClick);
//   document.addEventListener("keydown", disableKeys);

//   return () => {
//     document.removeEventListener("contextmenu", disableRightClick);
//     document.removeEventListener("keydown", disableKeys);
//   };
// }, []);


  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Mentorlogin" element={<MentorLogin />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/send" element={<Send />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/project" element={<Project />} />
        <Route path="/project1" element={<Project1 />} />
        <Route path="/task" element={<Task />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/media" element={<Media />} />
        <Route path="/chatbotf" element={<ChatbotF />} />
        <Route path="/chatbotflask" element={<ChatbotFlask />} />
        <Route path="/fakenews" element={<Fakenews />} />
        <Route path="/cogniflow" element={<Cogniflow />} />
          <Route path="/spamshield" element={<Spamshield />} />
    <Route path="/hiresense" element={<Hiresense />} />
    <Route path="/identiq" element={<IdentiQ />} />

        <Route path="/newpassword" element={<Newpassword />} />
        <Route path="/fastrack" element={<Fastrack />} />
        <Route path="/fortyfivedays" element={<FortyFiveDays />} />
        <Route path="/fourmonths" element={<FourMonths />} />
        {/* <Route path="/vscodepathsetup" element={<VscodePathSetup />} /> */}
        <Route path="/studenttasks" element={<StudentTasks />} />
        <Route path="taskdetails" element={<TaskDetails />} />
        <Route path="submissionhistory" element={<SubmissionHistory />} />
        <Route path="/taskcard" element={<TaskCard />} />
        <Route path="/progressbar" element={<ProgressBar />} />
        <Route path="/statusbadge" element={<StatusBadge />} />
        <Route path="/codeeditorbox" element={<CodeEditorBox />} />
        <Route path="/lockedbanner" element={<LockedBanner />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/terms-and-conditions"element={<TermsAndConditions />}/>

        {/* intern Dashboards */}
        <Route path="/interndashboard" element={<InternDashboard />} />
        <Route path="/interndashboardtask" element={<InternDashboardTask />} />
        <Route path="/interndashboardreport" element={<InternDashboardReport />} />
        <Route path="/InternDashboardCertificate" element={<InternDashboardCertificate />} />
        <Route path="/internlogout" element={<InternLogout />} />



           {/* admin  Dashboards */}
          <Route path="/admindashboard" element={<AdminDashboard />} /> 
          <Route path="/projectManagement" element={<ProjectManagement />} /> 
          <Route path="/paymentreport" element={<PaymentReport />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="admindashboarduser" element={<AdminDashboardUser />} />

            {/* all logins*/}
      
        <Route path="/internlogout" element={<InternLogout />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
          
      
        
    
            <Route path="/mentordashboard" element={<MentorDashboard />} />
                 
                 
         
      </Routes>
    </main>
  );
}
