import { useState, useRef, useEffect } from "react";
import AdminSidebar from "@/components/websection/AdminSidebar";
import axiosInstance from "@/api/axiosInstance";
import logo from "@/assets/logo.png";
import { useToast } from "@/hooks/useToast";

export function AdminProfileManagement() {
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    profile_pic: "",
    profile_pic_public_id: "",
    bio: "",
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showError, showSuccess } = useToast();
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const getAdminProfile = async () => {
    try {
      const response = await axiosInstance.get("/admin/profile");
      const userData = response.data.user;

      setProfileData({ ...userData });
      setProfilePicture(userData.profile_pic || logo);
      setCharacterCount(userData.bio ? userData.bio.length : 0);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      showError("Failed to fetch profile data");
    }
  };

  useEffect(() => {
    getAdminProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "bio") {
      setCharacterCount(value.length);
    }

    setProfileData({
      ...profileData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, profilePic: "File size must be less than 5MB" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, profilePic: "Only image files are allowed" });
      return;
    }

    setIsUploading(true);
    setErrors({ ...errors, profilePic: "" });

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await axiosInstance.post(
        "/admin/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.user) {
        // Update profile data with new information
        setProfileData(response.data.user);
        setProfilePicture(response.data.user.profile_pic);
        showSuccess("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to upload profile picture";
      setErrors({ ...errors, profilePic: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (profileData.bio && profileData.bio.length > 120) {
      newErrors.bio = "Bio must be 120 characters or less";
    }

    // Fix: Set errors state instead of calling showError with object
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axiosInstance.put("/admin/update-profile", {
        name: profileData.name.trim(),
        username: profileData.username.trim(),
        email: profileData.email.trim(),
        bio: profileData.bio ? profileData.bio.trim() : "",
      });

      if (response.data.user) {
        setProfileData(response.data.user);
        showSuccess("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update profile";

      // Handle specific field errors
      if (errorMessage.includes("username")) {
        setErrors({ username: errorMessage });
      } else if (errorMessage.includes("email")) {
        setErrors({ email: errorMessage });
      } else {
        // Fix: Show general error message instead of passing object
        showError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-[var(--color-background)] border-b border-[var(--color-brown-300)] py-6 px-20 flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-8 py-2 rounded-full shadow-md text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800 hover:cursor-pointer"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-10 px-15 py-10">
            {/* Profile Picture Section */}
            <div className="flex items-center">
              <div
                className="w-24 h-24 rounded-full overflow-hidden mr-4 bg-gray-200 cursor-pointer relative"
                onClick={handleProfilePictureClick}
              >
                <img
                  src={profilePicture || logo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={handleProfilePictureClick}
                  disabled={isUploading}
                  className={`border border-gray-300 rounded-full px-6 py-3 text-black ${
                    isUploading
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 hover:cursor-pointer"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload profile picture"}
                </button>
                {errors.profilePic && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.profilePic}
                  </p>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="border border-[var(--color-brown-300)] w-[476px]"></div>

            <div className="flex flex-col gap-[28px]">
              {/* Name Field */}
              <div className="w-[480px]">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Username Field */}
              <div className="w-[480px]">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="w-[480px]">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Bio Field */}
              <div className="h-[172px]">
                <label htmlFor="bio" className="block text-gray-700 mb-2">
                  Bio (max 120 letters)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio || ""}
                  onChange={handleInputChange}
                  maxLength={120}
                  rows={4}
                  className={`w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none ${
                    errors.bio ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio}</p>
                  )}
                  <div className="text-right text-sm text-gray-500 ml-auto">
                    {characterCount}/120
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
