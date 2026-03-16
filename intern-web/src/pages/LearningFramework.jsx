import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import ScrollReveal from "../components/ScrollReveal";
import {
  BookOpen,
  Layers,
  Code,
  Repeat,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Project-Centric Learning",
    desc: "Students begin with real-world projects, not abstract theory. Knowledge is acquired as a direct consequence of tackling authentic challenges, fostering responsibility and intrinsic motivation.",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Concepts in Context",
    desc: "Theoretical concepts are introduced precisely when they are needed to solve a problem within the project. This 'just-in-time' learning ensures knowledge is immediately applicable and retained.",
    icon: Layers,
  },
  {
    id: 3,
    title: "Real-Time Development Practices",
    desc: "Interns use the same tools, workflows, and communication protocols as professional engineering teams. This includes version control, code reviews, and agile methodologies.",
    icon: Code,
  },
  {
    id: 4,
    title: "Continuous Concept Clarification",
    desc: "Learning is not a one-time event. Through regular, structured interactions with mentors, interns continuously refine their understanding of core concepts, connecting theory to practice.",
    icon: Repeat,
  },
  {
    id: 5,
    title: "Mentored Evaluation",
    desc: "Assessment is performance-based, focusing on the quality of work, problem-solving skills, and professional conduct. Mentors provide constructive feedback rooted in industry standards.",
    icon: CheckCircle,
  },
  {
    id: 6,
    title: "Career Readiness & Professional Identity",
    desc: "The internship culminates in a tangible portfolio of work and the development of a professional identity. Interns learn to articulate their skills and experiences, preparing them for their careers.",
    icon: Briefcase,
  },
];

export default function LearningFramework() {
  // 🔵 refs + state (MUST be inside component)
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      const start = vh * 0.3;
      const end = vh * 0.85;

      let p = (start - rect.top) / (start - end);
      p = Math.min(Math.max(p, 0), 1);

      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-900">
      {/* HEADER */}
      <Header />

      {/* HERO */}
      {/* HERO – FULL WIDTH */}
      <section className="relative w-full min-h-screen px-6 py-24 overflow-hidden flex items-center">
        {/* BACKGROUND VIDEO */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/learning-bg.mp4" type="video/mp4" />
        </video>

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <h1 className="text-6xl font-semibold leading-tight max-w-4xl text-white rounded-3xl">
            A Project-Centric Academic–Industry Learning Model
          </h1>

          <p className="mt-9 text-4xl text-[#ffffff] max-w-2xl bg-[#1A3263]/50 p-4  rounded-tr-2xl rounded-bl-2xl ">
            InternsHub enables students to master academic concepts by building
            real-world systems under structured mentorship, industry workflows,
            and professional guidance.
          </p>

          <div className="mt-10 flex gap-6">
            <Link to="/learning-framework">
              <button className="px-6 py-3 bg-gaint-blue text-white text-xl hover:bg-blue-900 transition">
                View Learning Model
              </button>
            </Link>

            <Link to="/college-partnership">
              <button className="px-6 py-3 border border-gaint-blue text-gaint-blue text-xl hover:bg-gaint-light transition">
                Academic Partnership
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section
        ref={sectionRef}
        className="max-w-6xl mx-auto px-6 py-32 relative"
      >
        {/* CENTER DIVIDER */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex justify-center">
          {/* Base guide line */}
          <div className="absolute top-0 w-[2px] h-full bg-gray-200" />

          {/* Professional animated line */}
          <div
            className="
              absolute bottom-0
              w-[2px]
              bg-gradient-to-t from-blue-800 via-blue-600 to-blue-400
              origin-bottom
              will-change-transform
              professional-line
            "
            style={{
              height: "100%",
              transform: `scaleY(${1 - progress})`,
              transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>

        <div className="space-y-16 md:space-y-20">
          {steps.map((step, index) => {
            const isRight = index % 2 === 0;

            return (
              <ScrollReveal key={step.id} delay={index * 120}>
                <div
                  className={`relative flex w-full ${isRight ? "justify-start pl-8" : "justify-end pr-8"}`}
                >
                  {/* EXTRA CIRCLE – OPPOSITE SIDE */}

                  <div
                    className={`absolute top-[40%] ${
                      isRight ? "left-[70%]" : "left-[20%]"
                    }
          w-28 h-28 rounded-full
          bg-white/30 backdrop-blur-xl
          border border-blue-200/40
          shadow-lg
          flex items-center justify-center
          animate-[float_4s_ease-in-out_infinite]
          hover:scale-110 transition-transform`}
                  >
                    {step.icon && (
                      <step.icon className="w-10 h-10 text-blue-900" />
                    )}
                  </div>

                  {/* ORIGINAL CONTENT (UNCHANGED) */}
                  <div
                    className={`w-1/2 flex ${
                      isRight ? "justify-start pl-16" : "justify-end pr-16"
                    }`}
                  >
                    <div className="max-w-sm text-left">
                      {/* ORIGINAL CIRCLE – SAME PLACE */}
                      <div className="w-20 h-20 mb-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-3xl">
                        {step.id}
                      </div>

                      <h3 className="text-3xl font-semibold text-gray-900">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-gray-600 text-xl">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <div className="relative w-full overflow-hidden leading-none">
        <svg
          className="block w-full h-[120px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
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
                  A project-centric academic–industry internship platform
                  enabling students to build real systems under structured
                  mentorship.
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
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Programs
                  </li>
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Pricing
                  </li>
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
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Privacy Policy
                  </li>
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Terms & Conditions
                  </li>
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
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Partners
                  </li>
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Media
                  </li>
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
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Colleges
                  </li>
                  <li className="hover:text-gaint-blue cursor-pointer">
                    Students
                  </li>
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
             <Link to="/terms" className="hover:text-gaint-blue cursor-pointer">
  Privacy Policy
</Link>   
                {/* <span className="hover:text-gaint-blue cursor-pointer">
                  Terms
                </span>
                <span className="hover:text-gaint-blue cursor-pointer">
                  Code of Conduct
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
