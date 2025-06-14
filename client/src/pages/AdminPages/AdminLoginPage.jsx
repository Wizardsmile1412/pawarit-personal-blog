import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/useToast";

export function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { showError } = useToast();
  const { adminLogin, loading } = useAdminAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await adminLogin(formData);

    if (!result.success) {
      console.error("Admin login failed:", result.error);
      showError(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-start min-h-screen bg-[#F9F8F6]">
        {/* Main container - responsive width */}
        <div className="flex justify-center w-full mt-10 px-4 sm:px-8">
          {/* Form container - different widths for mobile/desktop */}
          <div
            className="flex flex-col items-center p-6 sm:p-12 md:p-16 lg:px-28 lg:py-16 my-8 sm:my-10 
                          w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl 
                          bg-[#EFEEEB] rounded-2xl"
          >
            <h2 className="text-xl font-semibold text-[#F2B68C] text-center mb-2 sm:mb-4">
              Admin Panel
            </h2>
            <h1 className="text-4xl font-semibold text-[#26231E] text-center mb-6 sm:mb-10">
              Log in
            </h1>

            {/* {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )} */}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-6 sm:gap-7"
            >
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium text-[#75716B]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  disabled={loading}
                  className="p-3 pl-4 border border-[#DAD6D1] rounded-lg bg-white text-base font-medium text-[#75716B] focus:outline-none focus:ring-1 focus:ring-[#26231E] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium text-[#75716B]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className="p-3 pl-4 border border-[#DAD6D1] rounded-lg bg-white text-base font-medium text-[#75716B] focus:outline-none focus:ring-1 focus:ring-[#26231E] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 py-3 px-10 bg-[#26231E] text-white font-medium rounded-full w-fit self-center hover:bg-[#3a3630] hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#26231E]"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
