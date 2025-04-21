import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/Global.css";
import coffeeHero from "@/assets/coffeeHero.jpg";
import logo from "../assets/logo.png";
import { FaLinkedin, FaGithub, FaGoogle } from "react-icons/fa";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="w-full h-[80px] bg-[#F9F8F6] border-b border-[#DAD6D1] flex items-center justify-between px-7 sm:px-9 md:px-20 py-5">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Logo" onClick={() => navigate("/")} className="w-20 h-20 hover:cursor-pointer md:w-22 md:h-22" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-[8px]">
          <a
            onClick={() => navigate("/login")}
            className="flex justify-center items-center w-[127px] h-[48px] bg-white text-black border border-[#75716B] text-[16px] text-center rounded-full 
          hover:shadow-lg hover:scale-105 hover:cursor-pointer transition duration-200"
          >
            {/* SVG Icon */}
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 122.88 96.84"
              className="w-5 h-5 fill-[#5E361C] mr-2"
            >
              <path
                className="st0"
                d="M31.96,0c14.08,0,26.03,12.61,30.29,30.11c-1.07,0.94-2.12,1.92-3.15,2.95c-9.36,9.36-15.11,20.63-16.82,31.26 c-1.2,7.41-0.44,14.53,2.38,20.54c-2.72,1.63-5.64,2.76-8.69,3.29c5.92-23.37,3.06-34.99-1.37-45.75 c-4.29-10.42-10.11-21.59-3.54-42.39C31.35,0.01,31.66,0,31.96,0L31.96,0z M115.57,26.95c12.48,12.48,8.59,36.61-8.69,53.89 c-15.95,15.95-37.73,20.49-50.8,11.29c20.71-12.34,26.9-22.58,31.38-33.32c4.33-10.4,8.12-22.42,27.47-32.47 C115.14,26.53,115.36,26.74,115.57,26.95L115.57,26.95z M53.98,90.46c-0.34-0.3-0.67-0.61-0.99-0.93 c-12.48-12.48-8.59-36.61,8.69-53.89c16.28-16.28,38.63-20.67,51.6-10.7C92.53,35.42,86.92,44.22,82.36,55.17 C78.08,65.43,73.45,78.58,53.98,90.46L53.98,90.46z M33.31,88.46c-0.45,0.03-0.9,0.04-1.35,0.04C14.31,88.5,0,68.69,0,44.25 C0,21.23,12.7,2.31,28.93,0.2c-7.27,22.08-5.01,32.27-0.5,43.23C32.66,53.72,38.68,66.29,33.31,88.46L33.31,88.46z"
              />
            </svg>
            Log in
          </a>

          <a
            onClick={() => navigate("/signup")}
            className="flex justify-center items-center w-[141px] h-[48px] bg-[#26231E] text-white border border-[#75716B] text-[16px] text-center rounded-full hover:scale-105 hover:cursor-pointer transition duration-200"
          >
            Sign up
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden w-[24px] h-[24px] flex flex-col justify-center items-center"
        >
          <span className="block w-[24px] h-[2px] bg-black mb-[5px]"></span>
          <span className="block w-[24px] h-[2px] bg-black mb-[5px]"></span>
          <span className="block w-[24px] h-[2px] bg-black"></span>
        </button>
      </nav>

      {/* Mobile Menu (conditionally rendered) */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#F9F8F6] border-b border-[#DAD6D1] py-4 px-4">
          <div className="flex flex-col items-center space-y-4">
            <a
              onClick={() => navigate("/login")}
              className="w-[80%] bg-white text-black border border-[#75716B] px-[40px] py-[12px] text-[16px] text-center rounded-full hover:shadow-lg hover:scale-105 transition duration-200"
            >
              Log in
            </a>
            <a
              onClick={() => navigate("/signup")}
              className="w-[80%] bg-[#26231E] text-white border border-[#75716B] px-[40px] py-[12px] text-[16px] text-center rounded-full hover:scale-105 transition duration-200"
            >
              Sign up
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-7 my-7 sm:flex-row sm:justify-between sm:px-20">
      {/* 1.1) Quote Block */}
      <div className="flex flex-col justify-center text-center sm:text-left sm:w-[40%] w-full">
        <h1 className="text-4xl font-bold">
          Coffee is more than a drink; it's a journey, a ritual, and a story in
          every cup.
        </h1>
        <p className="text-gray-600 my-8">
          Embark on a journey through the world of coffee. Explore rich flavors,
          brewing secrets, and stories that awaken your senses every day.
        </p>
      </div>

      {/* 1.2) Picture */}
      <div className="w-full sm:w-[49%] flex justify-center">
        <img
          src={coffeeHero}
          alt="Three portafilters"
          className="w-full h-auto object-cover rounded-[16px]"
        />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="w-full h-30 bg-[#EFEEEB] py-6 px-20 flex flex-col justify-around sm:flex-row sm:justify-between sm:items-center text-center">
      {/* Left: Social Media Section */}
      <div className="flex items-center gap-4 justify-center">
        <span className="text-[#43403B] font-medium">Get in touch</span>
        <FaLinkedin className="text-[#43403B] text-xl cursor-pointer hover:text-gray-600" />
        <FaGithub className="text-[#43403B] text-xl cursor-pointer hover:text-gray-600" />
        <FaGoogle className="text-[#43403B] text-xl cursor-pointer hover:text-gray-600" />
      </div>

      {/* Right: Home Page Link */}
      <a
        href="/"
        className="text-[#43403B] font-medium hover:underline hover:underline-offset-2 hover:text-[#26231E]"
      >
        Home page
      </a>
    </footer>
  );
}
