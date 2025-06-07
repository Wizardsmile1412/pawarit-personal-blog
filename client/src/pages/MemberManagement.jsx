import { MemberNavbar } from "@/components/websection/Navbar";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
import axiosInstance from "@/api/axiosInstance";
import { useToast } from "@/hooks/useToast";

export function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("profilePic", file);

      await axiosInstance.post("/auth/upload-profile-pic", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUser();

      showSuccess("Profile picture updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Upload failed. Please try again.";
      showError(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasChanges =
      formData.name !== user?.name || formData.username !== user?.username;

    if (!hasChanges) {
      return;
    }

    setIsUpdating(true);

    try {
      await axiosInstance.put("/auth/update-profile", {
        name: formData.name,
        username: formData.username,
      });

      await fetchUser();

      showSuccess("Profile updated successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Profile update failed. Please try again.";
      console.error("Profile update failed:", errorMessage);
      showError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-background)]">
      <MemberNavbar />
      {/* Left Menu Mobile */}
      <div className="flex flex-row w-full md:hidden">
        <div className="flex items-center px-4 py-3 rounded-lg bg-[#EFEEEB]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3"
          >
            <circle cx="12" cy="8" r="4" stroke="#75716B" strokeWidth="1.5" />
            <path
              d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
              stroke="#75716B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[#43403B] font-medium text-base">Profile</span>
        </div>
        <div
          className="flex items-center px-4 py-3 rounded-lg hover:bg-[#EFEEEB] cursor-pointer"
          onClick={() => navigate("/member-profile/reset-password")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3"
          >
            <path d="M14 15L10 19L14 23" stroke="#26231E" />
            <path
              d="M5.93782 15.5C5.14475 14.1264 4.84171 12.5241 5.07833 10.9557C5.31495 9.38734 6.07722 7.94581 7.24024 6.86729C8.40327 5.78877 9.8981 5.13721 11.4798 5.01935C13.0616 4.90149 14.6365 5.32432 15.9465 6.21856C17.2565 7.1128 18.224 8.42544 18.6905 9.94144C19.1569 11.4574 19.0947 13.0869 18.5139 14.5629C17.9332 16.0389 16.8684 17.2739 15.494 18.0656C14.1196 18.8573 12.517 19.1588 10.9489 18.9206"
              stroke="#26231E"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[#75716B] font-medium text-base">
            Reset password
          </span>
        </div>
      </div>
      {/* Profile Header */}
      <div className="flex flex-row items-center gap-4 px-4 py-6 md:px-80 md:mt-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#75716B] rounded-full overflow-hidden">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="heading-4 !text-[var(--color-brown-400)] sm:!text-2xl">
            {user?.username || "Username"}
          </span>
          <div className="h-6 w-px bg-[var(--color-brown-300)] mx-2"></div>
          <span className="heading-4 sm:!text-2xl">Profile</span>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex md:flex-row gap-14 md:px-80 md:mt-5">
        {/* Left Menu Desktop*/}
        <div className="hidden md:block md:w-50">
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
              <span className="body-1">Profile</span>
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
                <path d="M14 15L10 19L14 23" stroke="#26231E" />
                <path
                  d="M5.93782 15.5C5.14475 14.1264 4.84171 12.5241 5.07833 10.9557C5.31495 9.38734 6.07722 7.94581 7.24024 6.86729C8.40327 5.78877 9.8981 5.13721 11.4798 5.01935C13.0616 4.90149 14.6365 5.32432 15.9465 6.21856C17.2565 7.1128 18.224 8.42544 18.6905 9.94144C19.1569 11.4574 19.0947 13.0869 18.5139 14.5629C17.9332 16.0389 16.8684 17.2739 15.494 18.0656C14.1196 18.8573 12.517 19.1588 10.9489 18.9206"
                  stroke="#26231E"
                  strokeLinecap="round"
                />
              </svg>
              <span className="body-1 !text-[var(--color-brown-400)]">
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
              <div className="w-24 h-24 sm:w-30 sm:h-30 bg-[#75716B] rounded-full mx-auto sm:mx-0 overflow-hidden">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
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
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="flex justify-center items-center px-10 py-3 bg-white border border-[#75716B] rounded-full text-[#26231E] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload profile picture"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="hidden"
                />
              </div>
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
                    className="w-full bg-transparent outline-none text-[#43403B] text-base font-medium"
                    placeholder="Enter your name"
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
                    placeholder="Enter your username"
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
                  disabled={isUpdating}
                  className="bg-[#26231E] text-white rounded-full px-10 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Saving..." : "Save"}
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
  const { user, changePassword, state } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const handleResetClick = () => {
    setErrors({});
    setSuccess("");

    if (validateForm()) {
      setShowModal(true);
    }
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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (success) {
      setSuccess("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (errors.submit) {
      showError(errors.submit);
      setErrors((prev) => ({ ...prev, submit: "" }));
    }
  }, [errors.submit, showError]);

  useEffect(() => {
    if (success) {
      showSuccess(success);
      setSuccess("");
    }
  }, [success, showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (result.error) {
        setErrors({ submit: result.error });
      } else {
        setSuccess(result.message || "Password changed successfully!");

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred" });
      console.error("Password change error:", error);
    }

    setShowModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-background)]">
      <MemberNavbar />

      {/* Left Menu Mobile*/}
      <div className="flex flex-row w-full md:hidden">
        <div
          onClick={() => navigate("/member-profile")}
          className="flex items-center px-4 py-3 rounded-lg hover:bg-[#EFEEEB] cursor-pointer"
        >
          <svg
            className="mr-3"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="8" r="4" stroke="#75716B" strokeWidth="1.5" />
            <path
              d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
              stroke="#75716B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[#75716B] font-medium text-base">Profile</span>
        </div>
        <div className="flex items-center px-4 py-3 rounded-lg bg-[#EFEEEB] cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3"
          >
            <path d="M14 15L10 19L14 23" stroke="#26231E" />
            <path
              d="M5.93782 15.5C5.14475 14.1264 4.84171 12.5241 5.07833 10.9557C5.31495 9.38734 6.07722 7.94581 7.24024 6.86729C8.40327 5.78877 9.8981 5.13721 11.4798 5.01935C13.0616 4.90149 14.6365 5.32432 15.9465 6.21856C17.2565 7.1128 18.224 8.42544 18.6905 9.94144C19.1569 11.4574 19.0947 13.0869 18.5139 14.5629C17.9332 16.0389 16.8684 17.2739 15.494 18.0656C14.1196 18.8573 12.517 19.1588 10.9489 18.9206"
              stroke="#26231E"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[#43403B] font-medium text-base">
            Reset password
          </span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-row items-center gap-4 px-4 py-6 md:px-80 md:mt-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="heading-4 !text-[var(--color-brown-400)] sm:!text-2xl">
            {user?.username || user?.name || "Username"}
          </span>
          <div className="h-6 w-px bg-[var(--color-brown-300)] mx-2"></div>
          <span className="heading-4 sm:!text-2xl">Reset password</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full md:flex-row gap-14 md:px-80 md:mt-5">
        {/* Left Menu Desktop*/}
        <div className="hidden md:block md:w-50">
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
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path d="M14 15L10 19L14 23" stroke="#26231E" />
                <path
                  d="M5.93782 15.5C5.14475 14.1264 4.84171 12.5241 5.07833 10.9557C5.31495 9.38734 6.07722 7.94581 7.24024 6.86729C8.40327 5.78877 9.8981 5.13721 11.4798 5.01935C13.0616 4.90149 14.6365 5.32432 15.9465 6.21856C17.2565 7.1128 18.224 8.42544 18.6905 9.94144C19.1569 11.4574 19.0947 13.0869 18.5139 14.5629C17.9332 16.0389 16.8684 17.2739 15.494 18.0656C14.1196 18.8573 12.517 19.1588 10.9489 18.9206"
                  stroke="#26231E"
                  strokeLinecap="round"
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
          <form className="bg-[#EFEEEB] rounded-2xl p-6 md:p-10">
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
                  disabled={state.loading}
                  className={`w-full bg-white border rounded-lg px-4 py-3 outline-none text-[#43403B] font-medium ${
                    errors.currentPassword
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#DAD6D1] focus:border-blue-500"
                  } ${state.loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {errors.currentPassword && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.currentPassword}
                  </span>
                )}
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
                  disabled={state.loading}
                  className={`w-full bg-white border rounded-lg px-4 py-3 outline-none text-[#43403B] font-medium ${
                    errors.newPassword
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#DAD6D1] focus:border-blue-500"
                  } ${state.loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {errors.newPassword && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </span>
                )}
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
                  disabled={state.loading}
                  className={`w-full bg-white border rounded-lg px-4 py-3 outline-none text-[#43403B] font-medium ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-500"
                      : "border-[#DAD6D1] focus:border-blue-500"
                  } ${state.loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  onClick={handleResetClick}
                  type="button"
                  disabled={state.loading}
                  className={`bg-[#26231E] text-white rounded-full px-10 py-3 font-medium transition-colors ${
                    state.loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#3a3530] cursor-pointer"
                  }`}
                >
                  {state.loading ? "Processing..." : "Reset password"}
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
                      disabled={state.loading}
                      className="text-gray-400 text-lg hover:text-gray-600"
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
                      disabled={state.loading}
                      className="border border-black text-black py-1.5 px-4 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={state.loading}
                      className="bg-black text-white py-1.5 px-4 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {state.loading ? "Resetting..." : "Reset"}
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
