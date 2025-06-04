import { Navbar } from "../components/websection/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";

export function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const { register, state } = useAuth();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email must be a valid email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const result = await register(formData);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-start min-h-screen bg-[#F9F8F6]">
        {/* Main container - wider on desktop, fixed width on mobile */}
        <div className="flex flex-col items-center mx-4 m-10 sm:m-10 w-full max-w-sm sm:max-w-2xl">
          {/* Form container */}
          <div className="flex flex-col items-center p-4 sm:p-12 md:px-20 md:py-10 w-full bg-[#EFEEEB] rounded-2xl">
            <h1 className="text-4xl font-semibold text-[#26231E] text-center mb-6 sm:mb-8">
              Sign up
            </h1>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col w-full gap-6"
            >
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium text-[#75716B]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="p-3 pl-4 border border-[#DAD6D1] rounded-lg bg-white text-base font-medium text-[#75716B] focus:outline-none focus:ring-1 focus:ring-[#26231E]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-base font-medium text-[#75716B]">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="p-3 pl-4 border border-[#DAD6D1] rounded-lg bg-white text-base font-medium text-[#75716B] focus:outline-none focus:ring-1 focus:ring-[#26231E]"
                />
              </div>

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
                  className={`p-3 pl-4 border rounded-lg bg-white text-base font-medium focus:outline-none focus:ring-1 ${
                    errors.email
                      ? "border-[#EB5164] text-[#EB5164] focus:ring-[#EB5164]"
                      : "border-[#DAD6D1] text-[#75716B] focus:ring-[#26231E]"
                  }`}
                />
                {errors.email && (
                  <span className="text-[#EB5164] text-xs">{errors.email}</span>
                )}
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
                  className={`p-3 pl-4 border rounded-lg bg-white text-base font-medium focus:outline-none focus:ring-1 ${
                    errors.password
                      ? "border-[#EB5164] text-[#EB5164] focus:ring-[#EB5164]"
                      : "border-[#DAD6D1] text-[#75716B] focus:ring-[#26231E]"
                  }`}
                />
                {errors.password && (
                  <span className="text-[#EB5164] text-xs">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 py-3 px-10 bg-[#26231E] text-white font-medium rounded-full w-fit self-center hover:bg-[#3a3630] transition-colors"
                disabled={state.loading}
              >
                {state.loading ? "Signing up..." : "Sign up"}
              </button>

              <div className="flex justify-center items-center gap-3 mt-2">
                <span className="text-base text-[#75716B]">
                  Already have an account?
                </span>
                <a
                  onClick={() => navigate("/login")}
                  className="text-base font-medium text-[#26231E] underline hover:cursor-pointer"
                >
                  Log in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-start min-h-screen bg-[#F9F8F6]">
        <div className="flex flex-col items-center p-12 mt-12 md:p-16 bg-[#EFEEEB] rounded-2xl w-full max-w-xl mx-4">
          {/* Green circular success icon */}
          <div className="bg-green-500 rounded-full p-4 mb-6">
            <svg
              className="w-10 h-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          {/* Success message */}
          <h1 className="text-4xl font-semibold text-[#26231E] text-center mb-10">
            Registration success
          </h1>

          {/* Continue button */}
          <button
            onClick={() => navigate("/login")}
            className="py-3 px-12 bg-[#26231E] text-white font-medium rounded-full hover:bg-[#3a3630] transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
