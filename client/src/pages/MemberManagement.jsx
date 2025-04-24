import { MemberNavbar } from "@/components/Navbar";
import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "Name",
    username: "Username",
    email: "moodeng.cute@gmail.com",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the API call to update the profile
    console.log("Form submitted:", formData);
    // Add API call or further processing here
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F8F6]">
      <MemberNavbar />

      {/* Profile Header */}
      <div className="flex flex-row items-center gap-4 px-8 md:px-80 mt-12 sm:mt-16">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#75716B] rounded-full">
          <div className="flex items-center justify-center h-full w-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="8" r="4" stroke="#FFFFFF" strokeWidth="1.5" />
              <path
                d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#75716B] font-semibold text-lg sm:text-2xl">
            {formData.name}
          </span>
          <div className="h-6 w-px bg-[#DAD6D1] mx-2 hidden sm:block"></div>
          <span className="text-[#26231E] font-semibold text-lg sm:text-2xl hidden sm:block">
            Profile
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-14 px-8 md:px-80 mt-8 md:mt-8">
        {/* Left Menu */}
        <div className="w-full md:w-50">
          <div className="flex flex-col">
            <div className="flex items-center p-3 rounded-lg bg-[#EFEEEB]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="#75716B"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[#43403B] font-medium text-base">
                Profile
              </span>
            </div>
            <div
              onClick={() => navigate("/member-profile/reset-password")}
              className="flex items-center p-3 rounded-lg hover:bg-[#EFEEEB] cursor-pointer mt-1"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M16 15C16 15.7956 15.6839 16.5587 15.1213 17.1213C14.5587 17.6839 13.7956 18 13 18C12.2044 18 11.4413 17.6839 10.8787 17.1213C10.3161 16.5587 10 15.7956 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.89 14 15C14 15.7956 13.6839 16.5587 13.1213 17.1213"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13V15"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 4V2"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 4V2"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12C2 9.87827 2.84285 7.84344 4.34315 6.34315C5.84344 4.84285 7.87827 4 10 4H14C16.1217 4 18.1566 4.84285 19.6569 6.34315C21.1571 7.84344 22 9.87827 22 12V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V12Z"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#75716B] font-medium text-base">
                Reset password
              </span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="bg-[#EFEEEB] rounded-2xl p-6 md:p-10"
          >
            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
              <div className="w-24 h-24 sm:w-30 sm:h-30 bg-[#75716B] rounded-full mx-auto sm:mx-0">
                <div className="flex items-center justify-center h-full w-full">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <path
                      d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                className="flex justify-center items-center px-10 py-3 bg-white border border-[#75716B] rounded-full text-[#26231E] font-medium"
              >
                Upload profile picture
              </button>
            </div>

            <hr className="border-t border-[#DAD6D1] mb-10" />

            {/* Form Fields */}
            <div className="flex flex-col gap-7">
              {/* Name Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[#75716B] font-medium">Name</label>
                <div className="flex items-center bg-white border border-[#DAD6D1] rounded-lg px-4 py-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-[#43403B] font-medium"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[#75716B] font-medium">Username</label>
                <div className="flex items-center bg-white border border-[#DAD6D1] rounded-lg px-4 py-3">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-[#43403B] font-medium"
                  />
                </div>
              </div>

              {/* Email Field (Disabled) */}
              <div className="flex flex-col gap-1 opacity-40">
                <label className="text-[#75716B] font-medium">Email</label>
                <div className="flex items-center bg-[#EFEEEB] rounded-lg px-4 py-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-transparent outline-none text-[#75716B] font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-[#26231E] text-white rounded-full px-10 py-3 font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleResetClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password submitted:", formData);
    // Add API logic here
    setShowModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F8F6]">
      <MemberNavbar />

      {/* Header */}
      <div className="flex flex-row items-center gap-4 px-8 md:px-80 mt-12 sm:mt-16">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden">
          <img
            src={logo} // Replace with actual user image path
            alt="User avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#75716B] font-semibold text-lg sm:text-2xl">
            Moodeng ja
          </span>
          <div className="h-6 w-px bg-[#DAD6D1] mx-2 hidden sm:block"></div>
          <span className="text-[#26231E] font-semibold text-lg sm:text-2xl hidden sm:block">
            Reset password
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-14 px-8 md:px-80 mt-8 md:mt-8">
        {/* Left Menu */}
        <div className="w-full md:w-50">
          <div className="flex flex-col">
            <div
              onClick={() => navigate("/member-profile")}
              className="flex items-center p-3 rounded-lg hover:bg-[#EFEEEB] cursor-pointer"
            >
              <svg
                className="mr-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="#75716B"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[#75716B] font-medium text-base">
                Profile
              </span>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-[#EFEEEB] cursor-pointer mt-1">
              <svg
                className="mr-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16 15C16 15.7956 15.6839 16.5587 15.1213 17.1213C14.5587 17.6839 13.7956 18 13 18C12.2044 18 11.4413 17.6839 10.8787 17.1213C10.3161 16.5587 10 15.7956 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.89 14 15C14 15.7956 13.6839 16.5587 13.1213 17.1213"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13V15"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 4V2"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 4V2"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12C2 9.87827 2.84285 7.84344 4.34315 6.34315C5.84344 4.84285 7.87827 4 10 4H14C16.1217 4 18.1566 4.84285 19.6569 6.34315C21.1571 7.84344 22 9.87827 22 12V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V12Z"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#43403B] font-medium text-base">
                Reset password
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="bg-[#EFEEEB] rounded-2xl p-6 md:p-10"
          >
            <div className="flex flex-col gap-7">
              {/* Current password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#75716B] font-medium">
                  Current password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#DAD6D1] rounded-lg px-4 py-3 outline-none text-[#43403B] font-medium"
                />
              </div>

              {/* New password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#75716B] font-medium">
                  New password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#DAD6D1] rounded-lg px-4 py-3 outline-none text-[#43403B] font-medium"
                />
              </div>

              {/* Confirm new password */}
              <div className="flex flex-col gap-1">
                <label className="text-[#75716B] font-medium">
                  Confirm new password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#DAD6D1] rounded-lg px-4 py-3 outline-none text-[#43403B] font-medium"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  onClick={handleResetClick}
                  type="button"
                  className="bg-[#26231E] text-white rounded-full px-10 py-3 font-medium hover:cursor-pointer"
                >
                  Reset password
                </button>
              </div>
            </div>

            {/* Reset Password Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
                  <div className="flex justify-end">
                    <button
                      onClick={handleCancel}
                      className="text-gray-400 text-lg"
                    >
                      &times;
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Reset password</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Do you want to reset your password?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleCancel}
                      className="border border-black text-black py-1.5 px-4 rounded-full hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-black text-white py-1.5 px-4 rounded-full hover:bg-gray-800"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
