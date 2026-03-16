import React from "react";
import Header from "../components/Header.jsx";
import Button from "../components/SocialHoverButton";
import SocialHoverButton from "../components/SocialHoverButton";
import { Link } from "react-router-dom";





export default function CollegePartnership() {
  return (
    <div className="bg-[#EEF2F7] min-h-screen">

      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= HERO SECTION ================= */}
<section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">

  {/* BACKGROUND IMAGE */}
  <img
    src="/college-parthership.jpg"
    alt="College Partnership"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* DARK TRANSPARENT OVERLAY */}
  <div className="absolute inset-0 bg-black/40" />

  {/* HERO CONTENT */}
  <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center">

    {/* TITLE */}
    <h1 className="
      text-3xl
      sm:text-4xl
      md:text-5xl
      lg:text-6xl
      font-semibold
      text-white
      leading-tight
    ">
      College & University Partnership
    </h1>

    {/* DESCRIPTION */}
    <p className="
      mt-4
      sm:mt-6
      text-lg
      sm:text-xl
      md:text-5xl
      text-gray-200
      leading-relaxed
      max-w-3xl
      mx-auto
    ">
      A transparent, ethical academic–industry collaboration model
      designed to enhance student readiness and institutional outcomes.
    </p>

            {/* BUTTONS */}
       <div
  className="
    mt-8 sm:mt-10
    flex flex-col sm:flex-row
    gap-4 sm:gap-6
    justify-center items-center
  "
>
  {/* REQUEST MoU BUTTON */}
  <button
    onClick={() => {
      const name = prompt("Please enter your name");
      if (!name) return;

      const subject = encodeURIComponent("MoU Request");
      const body = encodeURIComponent(
        `Hello GAINT Clout Technologies,\n\nThis is ${name}. I would like to request the MoU for institutional partnership.\n\nRegards,\n${name}`
      );

      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=gaintclout@gmail.com&su=${subject}&body=${body}`,
        "_blank"
      );
    }}
    className="
      w-full sm:w-auto
      px-10 py-4
      bg-gaint-blue
      text-white
      text-lg sm:text-xl
      font-semibold
      rounded-xl
      hover:bg-blue-900
      transition
    "
  >
    Request MoU
  </button>

  {/* CONTACT GAINT BUTTON */}
  <button
    onClick={() => {
      const name = prompt("Please enter your name");
      if (!name) return;

      const message = `Hello GAINT Clout Technologies, this is ${name}`;
      const encodedMessage = encodeURIComponent(message);

      window.open(
        `https://wa.me/918897238849?text=${encodedMessage}`,
        "_blank"
      );
    }}
    className="
      w-full sm:w-auto
      px-10 py-4
      border-2 border-white
      text-white
      text-lg sm:text-xl
      font-semibold
      rounded-xl
      hover:bg-white
      hover:text-gaint-blue
      transition
    "
  >
    Contact GAINT
  </button>
</div>


  </div>

</section>

<section className="py-24 bg-[#F8FAFC]">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* TEXT BLOCK */}
<div>
  {/* Accent line */}
  <div className="w-10 h-[2px] bg-blue-600 mb-6" />

  <h2 className="text-6xl font-semibold text-gaint-blue">
    Academic Alignment
  </h2>

  <p className="mt-6 text-3xl text-gray-600 leading-relaxed max-w-4xl">
    InternsHub programs are structured to align with institutional
    curricula, learning outcomes, and accreditation frameworks,
    ensuring academic continuity alongside industry exposure.
  </p>

  {/* BULLET LIST */}
<ul className="mt-8 space-y-4 text-3xl text-gray-600">
  <li className="flex items-start gap-4">
    <span className="mt-3 w-2 h-2 bg-gray-700 rounded-full flex-shrink-0" />
    <span>
      Curriculum-aligned project frameworks
    </span>
  </li>

  <li className="flex items-start gap-4">
    <span className="mt-3 w-2 h-2 bg-gray-700 rounded-full flex-shrink-0" />
    <span>
      Outcome-based learning integration
    </span>
  </li>

  <li className="flex items-start gap-4">
    <span className="mt-3 w-2 h-2 bg-gray-700 rounded-full flex-shrink-0" />
    <span>
      Credit and semester compatibility
    </span>
  </li>

  <li className="flex items-start gap-4">
    <span className="mt-3 w-2 h-2 bg-gray-700 rounded-full flex-shrink-0" />
    <span>
      Faculty-guided academic collaboration
    </span>
  </li>
</ul>

</div>


        {/* VISUAL BLOCK */}
    <div className="relative">
      <div className="absolute -inset-4 bg-blue-50 rounded-3xl blur-2xl opacity-60" />
      <img
        src="/academic-alignment.png"
        alt="Academic Alignment Illustration"
        className="relative rounded-2xl shadow-xl w-full object-cover"
      />
    </div>
  </div>
</section>

{/* ================= SECTION 3: INSTITUTION ENGAGEMENT ================= */}
<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <div className="mb-16">
      <div className="w-10 h-[2px] bg-blue-600 mx-auto mb-6" />

      <h2 className="text-6xl font-semibold text-gaint-blue">
        Institutional Engagement
      </h2>

      <p className="mt-6 text-3xl text-gray-600 max-w-3xl mx-auto">
        GAINT enables institutions to connect students with tools, platforms,
        communities, and professional ecosystems through structured engagement.
      </p>
    </div>

    {/* ✅ ICONS SECTION (THIS WAS MISSING) */}
  <div className="flex justify-center mt-12">
  <SocialHoverButton />
</div>

  </div>
</section>



<section className="py-24 bg-[#F8FAFC]">
  <div className="max-w-6xl mx-auto px-6">

    {/* SECTION TITLE */}
    <div className="text-center mb-16">
      <div className="w-12 h-[2px] bg-gaint-blue mx-auto mb-6" />
      <h2 className="text-6xl font-semibold text-gaint-blue">
        Partnership Model
      </h2>
      <p className="mt-4 text-3xl text-gray-600">
        A principled collaboration framework built on trust and clarity
      </p>
    </div>

    {/* BADGES */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

      {/* NON-EXCLUSIVE */}
        <div
        className="bg-white border border-gray-200 rounded-2xl p-10 text-center
                  transition hover:shadow-[0_10px_30px_rgba(26,50,99,0.35)]"
      >
        <div className="text-4xl mb-4">🔓</div>
        <h3 className="text-3xl font-semibold text-gaint-blue">
          Non-Exclusive
        </h3>
        <p className="mt-3 text-xl text-gray-600">
          Institutions retain full autonomy and freedom of collaboration.
        </p>
      </div>


            {/* TRANSPARENT */}
        <div
        className="bg-white border border-gray-200 rounded-2xl p-10 text-center
                  shadow-[0_4px_15px_rgba(26,50,99,0.2)]
                  hover:shadow-[0_10px_30px_rgba(26,50,99,0.4)]
                  transition"
      >
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-3xl font-semibold text-gaint-blue">
          Transparent
        </h3>
        <p className="mt-3 text-xl text-gray-600">
          Clear processes, reporting, and governance at every stage.
        </p>
      </div>


      {/* ETHICAL */}
      <div
        className="bg-white border border-gray-200 rounded-2xl p-10 text-center
                  shadow-[0_4px_15px_rgba(26,50,99,0.2)]
                  hover:shadow-[0_10px_30px_rgba(26,50,99,0.4)]
                  transition"
      >
        <div className="text-4xl mb-4">⚖️</div>
        <h3 className="text-3xl font-semibold text-gaint-blue">
          Ethical
        </h3>
        <p className="mt-3 text-xl text-gray-600">
          Student-first, policy-aligned, and academically responsible.
        </p>
      </div>


    </div>
  </div>
</section>



<section className="py-24 bg-gaint-blue">
  <div className="max-w-5xl mx-auto px-6 text-center text-white">

    {/* HEADING */}
    <h2 className="text-6xl md:text-5xl font-semibold leading-tight">
      Ready to Partner with GAINT?
    </h2>

    {/* SUBTEXT */}
    <p className="mt-6 text-3xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
      Initiate a transparent, non-exclusive, and ethical academic–industry
      partnership designed to enhance student outcomes and institutional impact.
    </p>

    {/* CTA BUTTONS */}
    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">

                <button
        onClick={() => {
            const name = prompt("Please enter your name");

            if (!name) return;

            const subject = encodeURIComponent("MoU Request");
            const body = encodeURIComponent(
            `Hello GAINT Team,\n\nThis is ${name}. I would like to request the MoU.\n\nRegards,\n${name}`
            );

            window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=gaintclout@gmail.com&su=${subject}&body=${body}`,
            "_blank"
            );
        }}
        className="
            px-10 py-4
            bg-white text-gaint-blue
            text-xl font-semibold
            rounded-xl
            hover:bg-blue-50
            transition
        "
        >
        Request MoU
        </button>
            <button
                    onClick={() => {
                        const name = prompt("Please enter your name");

                        if (!name) return; // cancel or empty

                        const message = `Hello GAINT Clout Technologies, this is ${name}`;
                        const encodedMessage = encodeURIComponent(message);

                        window.open(
                        `https://wa.me/918897238849?text=${encodedMessage}`,
                        "_blank"
                        );
                    }}
                    className="
                        px-10 py-4
                        border-2 border-white
                        text-xl font-semibold
                        rounded-xl
                        hover:bg-white
                        hover:text-gaint-blue
                        transition
                    "
                    >
                    Contact GAINT
                    </button>


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


      {/* ================= FOOTER ================= */}
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
       <Link to="/terms" className="hover:text-gaint-blue cursor-pointer">
  Privacy Policy
</Link>   
          {/* <span className="hover:text-gaint-blue cursor-pointer">Terms</span>
          <span className="hover:text-gaint-blue cursor-pointer">Code of Conduct</span> */}
        </div>
      </div>

    </div>
  </div>
</footer>


    </div>
  );
}
