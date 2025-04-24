import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
      <div className="w-64 max-h-screen bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="text-3xl font-bold text-gray-700">
            hh<span className="text-green-500">.</span>
          </div>
          <div className="text-orange-300 mt-1">Admin panel</div>
        </div>

        <nav className="mt-6">
          <div className="bg-gray-200">
            <a 
            onClick={() => navigate("/article-management")} 
            className="flex items-center px-6 py-4 text-gray-700 hover:bg-gray-100">
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
              Article management
            </a>
          </div>

          <a
            onClick={() => navigate("/category-management")}
            className="flex items-center px-6 py-4 text-gray-500 hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 9h20M2 15h20M8 3v18M16 3v18" />
            </svg>
            Category management
          </a>

          <a
            href="#"
            className="flex items-center px-6 py-4 text-gray-500 hover:bg-gray-100"
          >
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
            Profile
          </a>

          <a
            href="#"
            className="flex items-center px-6 py-4 text-gray-500 hover:bg-gray-100"
          >
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
            Notification
          </a>

          <a
            href="#"
            className="flex items-center px-6 py-4 text-gray-500 hover:bg-gray-100"
          >
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
            Reset password
          </a>
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-gray-200">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-100"
          >
            <img src={logo} alt="logo" className="w-10 h-10 mr-1" />
            hh. website
          </a>

          <a
            href="#"
            className="flex items-center px-6 py-4 mb-1 text-gray-500 hover:bg-gray-100"
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
