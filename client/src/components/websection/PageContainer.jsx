import React from "react";
import "@/styles/globals.css";
import coffeeHero from "@/assets/coffeeHero.jpg";
import { FaLinkedin, FaGithub, FaGoogle } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full flex flex-col justify-between px-4 my-10 gap-10 sm:flex-row sm:justify-between sm:px-[120px] sm:my-[60px]">
      {/* 1.1) Quote Block */}
      <div className="flex flex-col justify-center w-full text-center gap-4 sm:w-[40%] sm:gap-6">
        <h1 className="heading-1 sm:text-right">
          Coffee is more than a drink—
          <br />
          it's a journey in every cup.
        </h1>

        <p className="body-1 text-secondary sm:text-right">
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

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="w-16 h-16 animate-spin text-foreground" />
        <p className="mt-4 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
