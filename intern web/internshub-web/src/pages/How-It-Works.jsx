import React from "react";
import { FolderKanban, SquareDashedBottomCode, Play , Award,  } from "lucide-react";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";


export default function HowItWorks() {
  const steps = [
    { title: "Project", icon: FolderKanban },
    { title: "Tools", icon: SquareDashedBottomCode},
    { title: "Execution", icon: Play  },
    { title: "Certificate", icon: Award },
  ];

  return (
    <div className="bg-[#EEF2F7] min-h-screen">

      {/* ================= HEADER ================= */}
      <Header />

     
      {/* ================= HERO VIDEO SECTION ================= */}
        <section className="relative w-full min-h-[60vh] md:min-h-[70vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">

          {/* VIDEO */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/how-it-works-bg.mp4" type="video/mp4" />
          </video>

          {/* DARK OVERLAY */}
          <div className="absolute inset-0" />

          
        </section>


      {/* ================= HOW IT WORKS CARD SECTION ================= */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">

          {/* CARD */}
          <div className="bg-white rounded-2xl shadow-xl px-16 py-20 relative overflow-hidden">

            {/* TITLE */}
            <div className="text-center mb-20">
              <div className="w-10 h-[2px] bg-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-semibold text-gray-900">
                              What Students Do ?
              </h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto text-2xl">
              Students actively engage in real-world tasks that build practical skills, professional discipline, and system-level understanding.
              </p>
            </div>

            {/* FLOW */}
            <div className="relative flex justify-between items-center">

              {/* DOTTED CONNECTOR */}
              <svg
                className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2"
                viewBox="0 0 1000 120"
                fill="none"
              >
                <path
                  d="M 0 60 C 150 10, 350 10, 500 60 C 650 110, 850 110, 1000 60"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              </svg>

              {/* STEPS */}
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                  className="relative z-10 flex flex-col items-center text-center w-1/4 min-h-[240px]"                  >
                    <div className="w-28 h-28 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                      <Icon className="w-14 h-14 text-blue-600" />
                    </div>
                    <p className="text-gray-800 text-2xl mt-10">
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

    

          <div className="relative w-full overflow-hidden leading-none">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,0 C240,40 480,60 720,50 960,40 1200,20 1440,10 L1440,120 L0,120 Z"
            fill="#1A3263"
          />
          </svg>
          </div>

              {/* FOOTER */}
                <footer className="relative overflow-hidden">

              {/* GLASS BACKGROUND LAYER */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />

              {/* OPTIONAL DIAGONAL LIGHT STRIP (image la) */}
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute right-0 top-0 h-full w-[160px]
                            bg-gradient-to-l
                            from-white/90
                            via-white/50
                            to-transparent
                            skew-x-[-6deg]"
                />
              </div>

  {/* FOOTER CONTENT */}
  <div className="relative z-10 border-t border-gray-200">
    <div className="max-w-6xl mx-auto px-6 py-16">

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

        {/* BRAND + DESC */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="GAINT Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
        />



          <h1 className="text-4xl font-semibold text-gray-500 mt-3">
            InternsHub
          </h1>
        </div>


          <p className="mt-4 text-gray-600 text-2xl leading-relaxed max-w-sm">
            A project-centric academic–industry internship platform enabling
            students to build real systems under structured mentorship.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <h4 className="text-3xl  text-gray-900 mb-4">Product</h4>
          <ul className="space-y-3 text-xl text-gray-600">
          <li>
            <Link
              to="/learning-framework"
              className="hover:text-gaint-blue cursor-pointer"
            >
              Learning Model
            </Link>
          </li>
            <li className="hover:text-gaint-blue cursor-pointer">Programs</li>
            <li className="hover:text-gaint-blue cursor-pointer">Pricing</li>
            <li>
              <a
                href="https://gaintclout.com/certificates/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gaint-blue cursor-pointer"
              >
                Certification
              </a>
            </li>
            <li className="hover:text-gaint-blue cursor-pointer">Privacy Policy</li>
            <li className="hover:text-gaint-blue cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-3xl  text-gray-900 mb-4">Company</h4>
          <ul className="space-y-3 text-xl text-gray-600">
          <li>
            <a
              href="https://gaintclout.com/about.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gaint-blue cursor-pointer"
            >
              About GAINT
            </a>
          </li>
          <li>
            <a
              href="https://gaintclout.com/career.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gaint-blue cursor-pointer"
            >
              Careers
            </a>
          </li>
                      <li className="hover:text-gaint-blue cursor-pointer">Partners</li>
            <li className="hover:text-gaint-blue cursor-pointer">Media</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-3xl  text-gray-900 mb-4">Support</h4>
          <ul className="space-y-3 text-xl text-gray-600">
        <li>
          <a
            href="https://gaintclout.com/contact.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gaint-blue cursor-pointer"
          >
            Contact
          </a>
        </li>
            <li className="hover:text-gaint-blue cursor-pointer">Colleges</li>
            <li className="hover:text-gaint-blue cursor-pointer">Students</li>
            <li className="hover:text-gaint-blue cursor-pointer">FAQs</li>
          </ul>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xl text-gray-500 gap-4">
        <div>
          © {new Date().getFullYear()} GAINT Clout Technologies Pvt Ltd
        </div>

        <div className="flex gap-6">
          <span className="hover:text-gaint-blue cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gaint-blue cursor-pointer">Terms</span>
          <span className="hover:text-gaint-blue cursor-pointer">Code of Conduct</span>
        </div>
      </div>

    </div>
  </div>
</footer>
    </div>
  );
}
