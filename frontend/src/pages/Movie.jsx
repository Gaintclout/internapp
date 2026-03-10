import React, { useState, useEffect } from "react";
import Logo from "/src/assets/Logo.png";
import BgImage from "/src/assets/bg-paper.png";
import { Download } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProfileMenu from "../components/ProfileMenu";

export default function Movie() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // ===========================
  // 🔹 Keen Slider Setup
  // ===========================
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 15 },
    breakpoints: {
      "(max-width: 768px)": { slides: { perView: 1, spacing: 10 } },
      "(min-width: 769px) and (max-width: 1024px)": {
        slides: { perView: 2, spacing: 10 },
      },
      "(min-width: 1025px)": { slides: { perView: 3, spacing: 15 } },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // ===========================
  // 🔹 Save project selection
  // ===========================
  useEffect(() => {
    saveProjectSelection();
  }, []);

  const saveProjectSelection = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/movie_recommendation_system_workflow.pdf",
        { project_name: "Movie Recommendation System" }
      );
      console.log("Backend:", response.data);
    } catch (error) {
      console.error("Error sending project:", error);
    }
  };

  // ===========================
  // 🔹 Download PDF
  // ===========================
  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(
        "/projects/materials/download/movie_recommendation_system_workflow.pdf",
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "movie_recommendation_system_workflow.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF");
    }
  };

  // ===========================
  // 🔹 Internship Navigation
  // ===========================
  const navigateByInternship = () => {
    const type = localStorage.getItem("selected_internship");

    switch (type) {
      case "fasttrack":
        navigate("/fastrack");
        break;
      case "days45":
        navigate("/fortyfivedays");
        break;
      case "semester4m":
        navigate("/fourmonths");
        break;
      default:
        navigate("/fortyfivedays");
    }
  };

  // ===========================
  // 🔹 Open VS Code via Extension
  // ===========================
  const openVSCodeByInternship = async () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("student_token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      // 1️⃣ Generate auth code
      const res = await api.post(
        "/auth/generate-auth-code",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const authCode = res.data.auth_code;

      // 2️⃣ Open VS Code (extension handles everything)
      // window.location.href =
      //   `vscode://gaintclout.internapp-vscode-extension?auth=${authCode}`;

      // 3️⃣ Go to internship task page
      setTimeout(() => navigateByInternship(), 1500);

    } catch (err) {
      console.error(err);
      alert("Session expired. Please login again.");
    }
  };

  // ===========================
  // 🔹 Auto-slide the carousel
  // ===========================
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  // ===========================
  // 🔹 Slides Data
  // ===========================
  const slides = [
    {
      title: "Movie Recommendation System",
      desc: "AI-driven tool suggesting movies using ML filtering.",
      img: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
    },
    {
      title: "Fake News Detector",
      desc: "ML model identifying fake news using NLP.",
      img: "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg",
    },
    {
      title: "Chatbot Using FastAPI",
      desc: "Smart assistant using FastAPI & NLP.",
      img: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
    },
    {
      title: "Cogniflow",
      desc: "AI workflow automation and analytics.",
      img: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png",
    },
  ];

  // ===========================
  // 🔹 UI Rendering
  // ===========================
        return (
        <div
        className="h-[70vh] flex flex-col items-center justify-center bg-gray-50
                  relative px-4 bg-cover bg-center bg-no-repeat rounded-xl
                  shadow-[0_0_30px_rgba(0,0,0,0.25)]"
        style={{
          backgroundImage: `url(${BgImage})`,
        }}
      >

     <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20">
   
             {/* Logo (left) */}
             <img
               src={Logo}
               alt="GAINT Logo"
               className="w-32"
             />
   
             {/* Profile Menu (right) */}
             <ProfileMenu />
           </div>

      {/* Heading + PDF Download */}
      <div className="absolute top-8 sm:top-10 right-4 sm:right-8 md:right-10 text-right max-w-[90%] sm:max-w-sm md:max-w-md">
        {/* <h2 className="text-base sm:text-2xl md:text-3xl font-semibold text-[#2563eb] leading-snug bg-[#EBF2FF] rounded-full px-4 py-2 text-center">
          Allocation Project & Tasks
        </h2> */}
        {/* 🔹 Blink animation style */}
        <style>
          {`
            @keyframes blinkEffect {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
            .blink-btn {
              animation: blinkEffect 1.2s infinite;
            }
          `}
        </style>

        

      </div>

      {/* Main Content */}
      <div className="relative -top-20 sm:-top-40 w-full max-w-4xl px-2 sm:px-6 md:px-10 text-center md:text-left mt-10 sm:mt-20">
        
        <h2 className="text-2xl font-semibold text-[#2563eb] mt-52 ">
          Movie Recommendation System
        </h2>

          <p className="text-gray-600 leading-relaxed">
          A movie recommendation system is an AI-driven tool that suggests
          movies using machine learning techniques like collaborative filtering
          and content-based filtering.
        </p>

        {/* ⭐ VS CODE BUTTON */}
      <div className="flex items-center gap-6 mt-8">
  
          {/* Task Evaluation Button */}
          <button
                    onClick={openVSCodeByInternship}
                    className="inline-flex items-center justify-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl shadow-lg active:scale-95 cursor-pointer"
                  >
                  Task Evaluation
                  </button>

          {/* Download PDF Button */}
          <a
            href="http://127.0.0.1:8000/projects/materials/download/movie_recommendation_system_workflow.pdf"
            className="blink-btn flex items-center gap-2 bg-[#2563eb]
                      text-white text-sm sm:text-base font-medium
                      px-4 sm:px-6 py-2 rounded-lg shadow transition-all"
          >
            Download PDF
            <Download className="w-4 sm:w-5 h-4 sm:h-5" />
          </a>

        </div>


      </div>


          <div ref={sliderRef} className="keen-slider mt-30 w-full max-w-6xl px-6 ">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="keen-slider__slide bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img src={slide.img} alt={slide.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#2563eb]">{slide.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

            <div className="flex justify-center mt-20 gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${
              currentSlide === idx ? "bg-red-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
