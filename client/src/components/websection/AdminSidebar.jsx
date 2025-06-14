import logo from "@/assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Menu items array for easier management
  const menuItems = [
    {
      path: "/article-management",
      label: "Article management",
      icon: (
        <svg
          className="w-5 h-5 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      ),
    },
    {
      path: "/category-management",
      label: "Category management",
      icon: (
        <svg
          className="w-6 h-6 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6C3 5.05719 3 4.58579 3.29289 4.29289C3.58579 4 4.05719 4 5 4H8.64593C9.30174 4 9.62965 4 9.8836 4.17193C10.1375 4.34387 10.2593 4.64832 10.5029 5.25722L10.9029 6.25722C11.4 7.49991 11.6485 8.12126 11.351 8.56063C11.0536 9 10.3844 9 9.04593 9H6.5H17C18.8856 9 19.8284 9 20.4142 9.58579C21 10.1716 21 11.1144 21 13V16C21 17.8856 21 18.8284 20.4142 19.4142C19.8284 20 18.8856 20 17 20H7C5.11438 20 4.17157 20 3.58579 19.4142C3 18.8284 3 17.8856 3 16V6Z"
            stroke="#75716B"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      path: "/admin-profile",
      label: "Profile",
      icon: (
        <svg
          className="w-5 h-5 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 10-16 0" />
        </svg>
      ),
    },
    {
      path: "/notification-page",
      label: "Notification",
      icon: (
        <svg
          className="w-5 h-5 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      path: "/admin-reset-password",
      label: "Reset password",
      icon: (
        <svg
          className="w-5 h-5 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-64 max-h-screen bg-white border-r border-gray-200">
      <div className="p-6 flex flex-col">
        <button
          onClick={() => navigate("/")}
          className="p-0 border-none bg-transparent cursor-pointer"
        >
          <img src={logo} alt="logo" className="w-20 h-20" />
        </button>
        <div className="text-orange-400 text-lg mt-0.5 ml-1">Admin panel</div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={currentPath === item.path ? "bg-gray-200" : ""}
          >
            <a
              onClick={() => navigate(item.path)}
              className={`flex items-center px-6 py-4 ${
                currentPath === item.path ? "text-gray-700" : "text-gray-500"
              } hover:bg-gray-100 cursor-pointer`}
            >
              {item.icon}
              {item.label}
            </a>
          </div>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 border-t border-gray-200">
        <a
          onClick={() => navigate("/")}
          className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
        >
          <img src={logo} alt="logo" className="w-10 h-10 mr-1" />
          hh. website
        </a>

        <a
          onClick={() => {
            // Add logout functionality here
            navigate("/admin-login");
          }}
          className="flex items-center px-6 py-4 mb-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
        >
          <svg
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </a>
      </div>
    </div>
  );
}
