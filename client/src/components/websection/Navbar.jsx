import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthenticationContext";
import "@/styles/globals.css";
import logo from "@/assets/logo.png";

export function Navbar() {
  const { isAuthenticated, state } = useAuth();

  if (state.getUserLoading) {
    return (
      <nav className="w-full h-[80px] bg-[#F9F8F6] border-b border-[#DAD6D1] flex items-center justify-center px-7 sm:px-9 md:px-20 py-5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#75716B]"></div>
      </nav>
    );
  }

  return isAuthenticated ? <MemberNavbar /> : <GuestNavbar />;
}

export function GuestNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="w-full h-[80px] bg-[var(--color-background)] border-b border-[var(--color-brown-300)] flex items-center justify-between px-4 sm:px-8 lg:px-[120px] py-4">
        {/* Logo */}
        <div className="logo flex-none">
          <img
            src={logo}
            alt="Logo"
            onClick={() => navigate("/")}
            className="w-[80px] h-[80px] hover:cursor-pointer"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="btn btn-secondary"
          >
            {/* SVG Icon */}
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 122.88 96.84"
              className="w-5 h-5 fill-[var(--color-brown-600)]"
            >
              <path
                className="st0"
                d="M31.96,0c14.08,0,26.03,12.61,30.29,30.11c-1.07,0.94-2.12,1.92-3.15,2.95c-9.36,9.36-15.11,20.63-16.82,31.26 c-1.2,7.41-0.44,14.53,2.38,20.54c-2.72,1.63-5.64,2.76-8.69,3.29c5.92-23.37,3.06-34.99-1.37-45.75 c-4.29-10.42-10.11-21.59-3.54-42.39C31.35,0.01,31.66,0,31.96,0L31.96,0z M115.57,26.95c12.48,12.48,8.59,36.61-8.69,53.89 c-15.95,15.95-37.73,20.49-50.8,11.29c20.71-12.34,26.9-22.58,31.38-33.32c4.33-10.4,8.12-22.42,27.47-32.47 C115.14,26.53,115.36,26.74,115.57,26.95L115.57,26.95z M53.98,90.46c-0.34-0.3-0.67-0.61-0.99-0.93 c-12.48-12.48-8.59-36.61,8.69-53.89c16.28-16.28,38.63-20.67,51.6-10.7C92.53,35.42,86.92,44.22,82.36,55.17 C78.08,65.43,73.45,78.58,53.98,90.46L53.98,90.46z M33.31,88.46c-0.45,0.03-0.9,0.04-1.35,0.04C14.31,88.5,0,68.69,0,44.25 C0,21.23,12.7,2.31,28.93,0.2c-7.27,22.08-5.01,32.27-0.5,43.23C32.66,53.72,38.68,66.29,33.31,88.46L33.31,88.46z"
              />
            </svg>
            Log in
          </button>

          {/* Sign Up Button */}
          <button
            onClick={() => navigate("/register")}
            className="btn btn-primary"
          >
            Sign up
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden w-[24px] h-[24px] flex flex-col justify-center items-center"
        >
          <span className="block w-[24px] h-[3px] bg-[var(--color-brown-400)] mb-[5px]"></span>
          <span className="block w-[24px] h-[3px] bg-[var(--color-brown-400)] mb-[5px]"></span>
          <span className="block w-[24px] h-[3px] bg-[var(--color-brown-400)]"></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute right-0 top-[80px] w-[375px] h-[200px] bg-[#F9F8F6] flex flex-col justify-center items-center px-6 py-10 gap-6"
          style={{
            boxShadow: "2px 2px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Log in Button */}
          <button
            onClick={() => navigate("/login")}
            className="btn btn-secondary w-full"
          >
            Log in
          </button>

          {/* Sign up Button */}
          <button
            onClick={() => navigate("/register")}
            className="btn btn-primary w-full"
          >
            Sign up
          </button>
        </div>
      )}
    </>
  );
}

export function MemberNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Create refs for dropdown menu
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
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
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Call logout from auth context
    navigate("/login");
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

        {/* Desktop Member Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Notification Bell */}
          <div
            className="flex justify-center items-center w-12 h-12 bg-white border border-[#EFEEEB] rounded-full cursor-pointer hover:bg-[#EFEEEB] transition duration-200"
            onClick={() => navigate("/notifications")}
          >
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Notification indicator */}
              {/* <div className="absolute top-0 right-0 w-2 h-2 bg-[#EB5164] rounded-full"></div> */}
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-[#75716B]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
              <span className="font-medium text-[16px] text-[#43403B]">
                {user?.name || "User Name"}
              </span>
              <div
                ref={profileButtonRef}
                className="cursor-pointer hover:bg-[#EFEEEB] rounded-full p-1 transition duration-200"
                onClick={toggleProfileMenu}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6L8 10L4 6"
                    stroke="#75716B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-[249px] bg-[#F9F8F6] rounded-xl shadow-lg py-2 z-50 border border-[#EFEEEB]"
              >
                {/* Profile Option */}
                <div
                  className="flex items-center px-4 py-3 hover:bg-[#EFEEEB] cursor-pointer transition duration-200"
                  onClick={() => navigate("/member-profile")}
                >
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
                  <span className="font-medium text-[16px] text-[#43403B]">
                    Profile
                  </span>
                </div>

                {/* Reset Password Option */}
                <div
                  className="flex items-center px-4 py-3 hover:bg-[#EFEEEB] cursor-pointer transition duration-200"
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
                      stroke-linecap="round"
                    />
                  </svg>
                  <span className="font-medium text-[16px] text-[#43403B]">
                    Reset password
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-[#DAD6D1] my-2"></div>

                {/* Log Out Option */}
                <div
                  className="flex items-center px-4 py-3 hover:bg-[#EFEEEB] cursor-pointer transition duration-200"
                  onClick={handleLogout}
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
                      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                      stroke="#75716B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 17L21 12L16 7"
                      stroke="#75716B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12H9"
                      stroke="#75716B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-medium text-[16px] text-[#43403B]">
                    Log out
                  </span>
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

      {/* Mobile Menu member navbar */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute right-0 top-[80px] w-[375px] h-[288px] bg-[#F9F8F6] flex flex-col items-start px-6 py-6 gap-4"
          style={{
            boxShadow: "2px 2px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* User Profile Header - Frame 427321544 */}
          <div className="flex flex-row justify-between items-start w-[327px] h-12 gap-4">
            {/* User Profile Section - Frame 427321489 */}
            <div className="flex flex-row items-center gap-2 w-[152px] h-12">
              {/* Profile Image */}
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden border border-[#EFEEEB]">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-[#75716B]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="hidden"
                    >
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

              {/* User Name */}
              <span
                className="w-24 h-6 font-medium text-base leading-6 text-[#43403B]"
                style={{ fontFamily: "Poppins" }}
              >
                {user?.name || "Moodeng ja"}
              </span>
            </div>

            {/* Notification Bell - Frame 427321512 */}
            <div className="flex justify-center items-center w-12 h-12 bg-white border border-[#EFEEEB] rounded-full">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="#75716B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Menu Items Container - Frame 427321543 */}
          <div className="flex flex-col items-start w-[327px] h-24">
            {/* Profile Option - Frame 427321501 */}
            <div
              className="flex flex-row justify-center items-center px-4 py-3 gap-3 w-[327px] h-12 cursor-pointer hover:bg-[#EFEEEB] transition duration-200"
              onClick={() => navigate("/member-profile")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="#75716B"
                  strokeWidth="1.2"
                />
                <path
                  d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
                  stroke="#75716B"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="w-[259px] h-6 font-medium text-base leading-6 text-[#43403B] flex-grow"
                style={{ fontFamily: "Poppins" }}
              >
                Profile
              </span>
            </div>

            {/* Reset Password Option - Frame 427321500 */}
            <div
              className="flex flex-row justify-center items-center px-4 py-3 gap-3 w-[327px] h-12 cursor-pointer hover:bg-[#EFEEEB] transition duration-200"
              onClick={() => navigate("/member-profile/reset-password")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14 15L10 19L14 23" stroke="#75716B" strokeWidth="1" />
                <path
                  d="M5.93782 15.5C5.14475 14.1264 4.84171 12.5241 5.07833 10.9557C5.31495 9.38734 6.07722 7.94581 7.24024 6.86729C8.40327 5.78877 9.8981 5.13721 11.4798 5.01935C13.0616 4.90149 14.6365 5.32432 15.9465 6.21856C17.2565 7.1128 18.224 8.42544 18.6905 9.94144C19.1569 11.4574 19.0947 13.0869 18.5139 14.5629C17.9332 16.0389 16.8684 17.2739 15.494 18.0656C14.1196 18.8573 12.517 19.1588 10.9489 18.9206"
                  stroke="#75716B"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="w-[259px] h-6 font-medium text-base leading-6 text-[#43403B] flex-grow"
                style={{ fontFamily: "Poppins" }}
              >
                Reset password
              </span>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-[327px] h-0 border-t border-[#DAD6D1]"></div>

          {/* Logout Option - Frame 427321502 */}
          <div
            className="flex flex-row justify-center items-center px-4 py-3 gap-3 w-[327px] h-12 cursor-pointer hover:bg-[#EFEEEB] transition duration-200"
            onClick={handleLogout}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="#75716B"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="#75716B"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="#75716B"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="w-[259px] h-6 font-medium text-base leading-6 text-[#43403B] flex-grow"
              style={{ fontFamily: "Poppins" }}
            >
              Log out
            </span>
          </div>
        </div>
      )}
    </>
  );
}
