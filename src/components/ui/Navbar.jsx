import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@/assets/Global.css";
import logo from "../../assets/logo.png";

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
          <img
            src={logo}
            alt="Logo"
            onClick={() => navigate("/")}
            className="w-20 h-20 hover:cursor-pointer md:w-22 md:h-22"
          />
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

export function MemberNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Create refs for dropdown menu
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Handle click outside of dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      // Close dropdown if click is outside dropdown and not on the profile button
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current && 
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="w-full h-[80px] bg-[#F9F8F6] border-b border-[#DAD6D1] flex items-center justify-between px-7 sm:px-9 md:px-20 py-5">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Logo" onClick={() => navigate("/")} className="w-20 h-20 hover:cursor-pointer md:w-22 md:h-22" />
        </div>

        {/* Desktop Member Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Notification Bell */}
          <div className="flex justify-center items-center w-12 h-12 bg-white border border-[#EFEEEB] rounded-full">
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Notification indicator */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#EB5164] rounded-full"></div>
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            <div 
              className="flex items-center gap-2" 
            >
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
                {/* User Image */}
                <img src={logo} alt="User" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium text-[16px] text-[#43403B]">User Name</span>
              <div
              ref={profileButtonRef}
              className="cursor-pointer" 
              onClick={toggleProfileMenu}
              >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6L8 10L4 6" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-[249px] bg-[#F9F8F6] rounded-xl shadow-lg py-2 z-50"
              >
                {/* Profile Option */}
                <div className="flex items-center px-4 py-3 hover:bg-[#EFEEEB] cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                    <circle cx="12" cy="8" r="4" stroke="#75716B" strokeWidth="1.5"/>
                    <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="font-medium text-[16px] text-[#43403B]">Profile</span>
                </div>
                
                {/* Reset Password Option */}
                <div className="flex items-center px-4 py-3 hover:bg-[#EFEEEB] cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                    <path d="M16 15C16 15.7956 15.6839 16.5587 15.1213 17.1213C14.5587 17.6839 13.7956 18 13 18C12.2044 18 11.4413 17.6839 10.8787 17.1213C10.3161 16.5587 10 15.7956 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.89 14 15C14 15.7956 13.6839 16.5587 13.1213 17.1213" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12C2 9.87827 2.84285 7.84344 4.34315 6.34315C5.84344 4.84285 7.87827 4 10 4H14C16.1217 4 18.1566 4.84285 19.6569 6.34315C21.1571 7.84344 22 9.87827 22 12V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V12Z" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 4V2" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 4V2" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13V15" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-medium text-[16px] text-[#43403B]">Reset password</span>
                </div>
                
                {/* Divider */}
                <div className="border-t border-[#DAD6D1] my-2"></div>
                
                {/* Log Out Option */}
                <div className="flex items-center px-4 py-3 hover:bg-[#EFEEEB] cursor-pointer" onClick={() => navigate('/login')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-medium text-[16px] text-[#43403B]">Log out</span>
                </div>
              </div>
            )}
          </div>
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
            {/* User Profile Mobile */}
            <div className="flex items-center gap-3 w-full p-3 border-b border-[#EFEEEB]">
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
                <img src="/user-profile.png" alt="User" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium text-[16px] text-[#43403B]">Moodeng ja</span>
            </div>
            
            {/* Profile Option */}
            <div className="flex items-center gap-2 w-full p-3" onClick={() => navigate('/profile')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="#75716B" strokeWidth="1.5"/>
                <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[16px] text-[#43403B]">Profile</span>
            </div>
            
            {/* Reset Password Option */}
            <div className="flex items-center gap-2 w-full p-3" onClick={() => navigate('/reset-password')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 15C16 15.7956 15.6839 16.5587 15.1213 17.1213C14.5587 17.6839 13.7956 18 13 18C12.2044 18 11.4413 17.6839 10.8787 17.1213C10.3161 16.5587 10 15.7956 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.89 14 15C14 15.7956 13.6839 16.5587 13.1213 17.1213" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12C2 9.87827 2.84285 7.84344 4.34315 6.34315C5.84344 4.84285 7.87827 4 10 4H14C16.1217 4 18.1566 4.84285 19.6569 6.34315C21.1571 7.84344 22 9.87827 22 12V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V12Z" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 4V2" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 4V2" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13V15" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[16px] text-[#43403B]">Reset password</span>
            </div>
            
            {/* Notifications Section */}
            <div className="flex items-center gap-2 w-full p-3" onClick={() => navigate('/notifications')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[16px] text-[#43403B]">Notifications</span>
            </div>
            
            {/* Divider */}
            <div className="border-t border-[#DAD6D1] w-full"></div>
            
            {/* Logout Option */}
            <div className="flex items-center gap-2 w-full p-3" onClick={() => navigate('/login')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="#75716B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[16px] text-[#43403B]">Log out</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
