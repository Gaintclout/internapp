import Header from "../components/Header.jsx";
import Card from "../components/Card.jsx";
import {
  UserPlus,
  ClipboardList,
  BookOpen,
  Users,
  CheckCircle,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";




export default function InternsHubOverview() {
  return (
    <div className="bg-white text-gray-900">

      {/* RESPONSIVE MENU BAR */}
      <Header />

  
      {/* HERO – FULL SCREEN VIDEO */}
      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">


      {/* BACKGROUND VIDEO (UNCHANGED) */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/internship-bg.mp4" type="video/mp4" />
      </video>

      {/* CONTENT WRAPPER – WIDTH REDUCED */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        {/* ⬆️ earlier max-w-6xl, ippudu max-w-4xl */}

      <h1 className="text-6xl font-semibold leading-tight max-w-3xl text-gaint-blue">
        A Project-Centric Academic–Industry Internship Platform
      </h1>

        <p className="mt-9 text-4xl text-[#FAB95B] max-w-2xl bg-black/50 p-4 rounded-3xl ">
          InternsHub enables students to learn academic concepts by
          building real systems under structured mentorship and
          professional guidance.
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




      {/* PROBLEM CONTEXT */}
      <section className="bg-gaint-gray">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">

          <div>
            <h2 className="text-6xl font-semibold text-gaint-blue">
              The Academic–Industry Gap
            </h2>

                <p className="mt-4 text-gray-600 text-3xl">
                Traditional education emphasizes theoretical instruction,
                while professional environments demand applied problem-solving,
                system thinking, and tool proficiency.
                </p>


            <p className="mt-4 text-gray-600 text-3xl">
              InternsHub bridges this gap by embedding learning directly
              into real project execution supported by structured mentorship.
            </p>
          </div>

        <div className="flex items-center justify-center">
        <img
          src="/academic-industry-gap.png"
          alt="Academic Industry Gap Illustration"
          className="
            w-full 
            max-w-lg 
            md:max-w-xl 
            h-[380px] 
            md:h-[480px] 
            object-contain
          "
        />

        </div>


        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="max-w-6xl mx-auto px-6 py-20 bg-gradient-to-b from-white to-blue-50 border border-gray-200 rounded-2xl">

      {/* SECTION HEADING */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-semibold text-gaint-blue">
          What Sets InternsHub Apart
        </h1>

        <p className="mt-4 text-3xl text-gray-600 max-w-3xl mx-auto">
          A project-first, outcome-driven academic–industry learning model
        </p>
      </div>

        {/* DIFFERENTIATOR CARDS */}
        <div className="grid md:grid-cols-3 gap-12 justify-items-center">

          <Card
            title="Project Before Curriculum"
            description="Learning begins with responsibility and real project ownership."
          />

          <Card
            title="Contextual Learning"
            description="Concepts arise naturally while solving real-world problems."
          />

          <Card
            title="Mentored Growth"
            description="Guided professional development under expert mentorship."
          />

        </div>
      </section>


      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-5xl font-semibold text-center mb-16">
          Internship Timeline
        </h2>

        <div className="relative">
          {/* CONNECTING LINE */}
          <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gray-300"></div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 text-center relative z-10 ">
            <TimelineItem icon={<UserPlus />} label="Enrollment" />
            <TimelineItem icon={<ClipboardList />} label="Project Assignment" />
            <TimelineItem icon={<BookOpen />} label="Guided Learning" />
            <TimelineItem icon={<Users />} label="Mentored Development" />
            <TimelineItem icon={<CheckCircle />} label="Evaluation" />
            <TimelineItem icon={<Award />} label="Certification" />
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


function TimelineItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-gaint-blue text-white flex items-center justify-center shadow-md transition hover:scale-110">
        {icon}
      </div>
      <p className="mt-4 text-2xl font-medium text-gray-800">
        {label}
      </p>
    </div>
  );
}