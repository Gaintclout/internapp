import { useState } from "react";
import HamburgerSwitch from "./HamburgerSwitch";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `relative pb-1 transition-colors ${
      isActive
        ? "text-gaint-blue after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-gaint-blue"
        : "text-gray-700 hover:text-gaint-blue"
    }`;

  const mobileNavClass = ({ isActive }) =>
    isActive
      ? "text-gaint-blue font-semibold"
      : "text-gray-700 hover:text-gaint-blue";

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="GAINT InternsHub"
            className="h-8 w-auto"
          />
          <span className="text-3xl font-semibold text-gray-600">
            InternsHub
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10 text-xl font-medium">
          <NavLink to="/" className={navClass}>
            Overview
          </NavLink>

          <NavLink to="/learning-framework" className={navClass}>
            Learning Model
          </NavLink>

          <NavLink to="/how-it-works" className={navClass}>
            How It Works
          </NavLink>

          <NavLink to="/college-partnership" className={navClass}>
            College Partnership
          </NavLink>

          <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className={navClass}
        >
          Login / Signup
        </a>
        
        </nav>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden">
          <HamburgerSwitch
            open={open}
            toggle={() => setOpen(!open)}
          />
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-6 py-6 gap-6 text-xl font-medium">
            <NavLink to="/" onClick={() => setOpen(false)} className={mobileNavClass}>
              Overview
            </NavLink>

            <NavLink to="/learning-framework" onClick={() => setOpen(false)} className={mobileNavClass}>
              Learning Model
            </NavLink>

            <NavLink to="/how-it-works" onClick={() => setOpen(false)} className={mobileNavClass}>
              How It Works
            </NavLink>

            <NavLink to="/college-partnership" onClick={() => setOpen(false)} className={mobileNavClass}>
              College Partnership
            </NavLink>

            <NavLink to="/login" onClick={() => setOpen(false)} className={mobileNavClass}>
              Login/Signup
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
