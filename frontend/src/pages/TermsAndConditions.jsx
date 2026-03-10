import React from "react";
import Logo from "/src/assets/logo.png";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen  px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <img src={Logo} alt="GAINT Logo" className="w-24" />
          <h1 className="text-3xl font-bold text-blue-700">
            Terms & Conditions
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using GAINT Clout Technologies platforms, you
              agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              2. User Responsibilities
            </h2>
            <p>
              Users must provide accurate information and must not misuse
              the platform for unlawful activities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              3. Intellectual Property
            </h2>
            <p>
              All content, certificates, course materials, and branding are
              the intellectual property of GAINT Clout Technologies Pvt. Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              4. Certificates
            </h2>
            <p>
              Certificates are issued only upon successful completion of
              assigned tasks and verification by GAINT authorities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              5. Termination
            </h2>
            <p>
              GAINT reserves the right to suspend or terminate access if
              terms are violated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              6. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of India.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-10 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} GAINT Clout Technologies Pvt. Ltd.
        </div>
      </div>
    </div>
  );
}
