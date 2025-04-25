import { useState, useRef } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import logo from "@/assets/logo.png";

export function AdminProfileManagement() {
  const [profileData, setProfileData] = useState({
    name: "Thompson P.",
    username: "thompson",
    email: "thompson.p@gmail.com",
    bio: "I am a pet enthusiast and freelance writer."
  });
  const [profilePicture, setProfilePicture] = useState(""); // Placeholder
  const [characterCount, setCharacterCount] = useState(profileData.bio.length);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "bio") {
      setCharacterCount(value.length);
    }
    
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real implementation, you would upload the file to a server
    // For the mockup, we'll just create a local URL
    const imageUrl = URL.createObjectURL(file);
    setProfilePicture(imageUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Just prevent default form submission for the mockup
    console.log("Profile data would be saved:", profileData);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 py-6 px-20 flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-800 inline-block">
            Profile
          </h1>
          <button 
            onClick={handleSubmit}
            className="bg-gray-900 text-white px-8 py-2 rounded-full shadow-md hover:bg-gray-800">
            Save
          </button>
        </header>

        <div className="px-20 py-10">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Section */}
            <div className="flex items-center mb-8">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden mr-4 bg-gray-200 cursor-pointer"
                onClick={handleProfilePictureClick}
              >
                {/* Using a placeholder image to match the screenshot */}
                <img 
                  src={profilePicture || logo} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button 
                type="button"
                onClick={handleProfilePictureClick}
                className="bg-white border border-gray-300 rounded-full px-6 py-3 text-black hover:bg-gray-50">
                Upload profile picture
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
            </div>

            <div className="border-t border-gray-200 pt-8">
              {/* Name Field */}
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Username Field */}
              <div className="mb-6">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Bio Field */}
              <div className="mb-6">
                <label htmlFor="bio" className="block text-gray-700 mb-2">
                  Bio (max 120 letters)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  maxLength={120}
                  rows={4}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                ></textarea>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {characterCount}/120
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}