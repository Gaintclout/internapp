// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// export default function GlobalGuard({ children }) {
//   const location = useLocation();

//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("student_token");

//   // ✅ Public pages (NO login needed)
//   const publicRoutes = [
//     "/",
//     "/studentlogin",
//     "/adminlogin",
//     "/mentorlogin",
//     "/register",
//     "/forgotpassword",
//     "/send",
//   ];

//   // 🚫 Pages user should NEVER go back to after login
//   const blockAfterLogin = [
//     "/studentlogin",
//     "/adminlogin",
//     "/mentorlogin",
//     "/register",
//     "/forgotpassword",
//   ];

//   // ❌ Not logged in → block protected pages
//   if (!token && !publicRoutes.includes(location.pathname)) {
//     return <Navigate to="/studentlogin" replace />;
//   }

//   // ❌ Logged in → block login/register pages
//   if (token && blockAfterLogin.includes(location.pathname)) {
//     return <Navigate to="/project" replace />;
//   }

//   return children;
// }
