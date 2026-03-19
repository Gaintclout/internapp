import React from "react";
import logo from "../assets/logo.png";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8 border-b pb-4">
          <img src={logo} alt="logo" className="w-20 md:w-24" />

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
              Terms & Conditions
            </h1>
            <p className="text-gray-500 text-sm">
              GAINT Clout Technologies Pvt. Ltd.
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using GAINT Clout Technologies platforms, you
              agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              2. User Responsibilities
            </h2>
            <p>
              Users must provide accurate information and must not misuse
              the platform for unlawful activities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              3. Intellectual Property
            </h2>
            <p>
              All content, certificates, course materials, and branding are
              the intellectual property of GAINT Clout Technologies Pvt. Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              4. Certificates
            </h2>
            <p>
              Certificates are issued only upon successful completion of
              assigned tasks and verification by GAINT authorities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              5. Termination
            </h2>
            <p>
              GAINT reserves the right to suspend or terminate access if
              terms are violated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              6. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of India.
            </p>
          </section>

        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-4 border-t text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} GAINT Clout Technologies Pvt. Ltd.  
          <br />
          All Rights Reserved.
        </div>

      </div>
    </div>
  );
}