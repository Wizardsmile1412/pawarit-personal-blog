import React from "react";
import "@/assets/Global.css";
import coffeeHero from "@/assets/coffeeHero.jpg";
import { FaLinkedin, FaGithub, FaGoogle } from "react-icons/fa";

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
