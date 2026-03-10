
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

import Logo from "/src/assets/logo.png";
import QRCode from "/src/assets/QR.jpeg";

export default function PaymentPage() {

  const [form, setForm] = useState({
    upi: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================================
  // RAZORPAY PAYMENT FUNCTION
  // ================================

  const handleFinalPayment = async () => {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch("http://127.0.0.1:8000/payments/project", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      const options = {
        key: data.razorpay_key,
        amount: data.amount * 100,
        currency: "INR",
        name: "GAINT CLOUT TECHNOLOGIES",
        description: "Internship Project Payment",
        order_id: data.order_id,

        handler: async function (response) {

  try {

    const token = localStorage.getItem("token");

    await fetch("http://127.0.0.1:8000/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      })
    });

    alert("✅ Payment Successful");

    const lang = localStorage.getItem("preferred_language");

    if (lang === "nextjs") {
      navigate("/project1");
    } else {
      navigate("/project");
    }

  } catch (error) {

    console.error("Payment verification failed", error);
    alert("Payment verification failed");

  }

},

        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {

      console.error(error);
      alert("Payment failed");

    }

  };

  return (
    <div className="min-h-[20vh] bg-white flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-10 relative rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.25)]">

      {/* TOP BAR */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">

        {/* LOGO */}
        <img
          src={Logo}
          alt="GAINT Logo"
          className="w-28 md:w-36"
        />

        {/* PROFILE */}
        <ProfileMenu />

      </div>


      {/* PAYMENT SECTION */}

      <div className="w-full md:w-1/3 flex flex-col items-center mt-9">

        <p className="text-gray-700 mb-3 font-medium text-center">
          Scan to pay
        </p>

        <img
          src={QRCode}
          alt="QR Code"
          className="w-[220px] h-[220px] border border-gray-200 rounded-xl shadow-sm mb-5"
        />

        <div className="flex items-center justify-center my-6 w-60">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-gray-400 text-sm font-medium">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>


        {/* UPI INPUT */}

        <div className="relative mb-6 w-full sm:w-[80%] pt-4">

          <label className="absolute top-1 left-6 bg-white px-2 text-xs text-blue-600 z-10 pointer-events-none">
            UPI ID / Mobile Number
          </label>

          <div className="flex items-center border border-blue-400 rounded-full h-14 px-2">

            <input
              type="text"
              name="upi"
              value={form.upi}
              onChange={handleChange}
              placeholder="Enter UPI ID or Mobile Number"
              className="flex-1 px-3 bg-transparent outline-none text-sm pt-2"
            />

            <div className="h-6 w-px bg-blue-300 ml-4"></div>

            <select
              className="h-full min-w-[90px] px-3 pr-6 bg-transparent outline-none text-blue-600 text-sm font-medium cursor-pointer appearance-auto"
            >
              <option>@ybl</option>
              <option>@oksbi</option>
              <option>@okaxis</option>
              <option>@okhdfcbank</option>
              <option>@paytm</option>
            </select>

          </div>

        </div>


        {/* PAY BUTTON */}

        <button
          onClick={handleFinalPayment}
          className="bg-[#2563eb] text-white text-lg px-12 py-3 rounded-full font-semibold hover:bg-[#1e4ed8] transition mt-3"
        >
          Pay
        </button>


        <p className="text-gray-400 text-sm mt-6">
          *Money will be refunded in case of failure
        </p>

      </div>

    </div>
  );

}
