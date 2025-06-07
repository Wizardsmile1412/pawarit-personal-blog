import { Navbar } from "@/components/websection/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
import { useToast } from "@/hooks/useToast";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const { showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = true; // Just mark as error for styling
      showError("Invalid email format");
    }
    
    if (formData.password.length < 6) {
      newErrors.password = true; // Just mark as error for styling
      showError("Password must be at least 6 characters");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const result = await login(formData);
    if (result?.error) {
      console.error("error from server", result.error);
      showError(result.error, "Please try another password or email");
      // Show visual styling on both email and password fields for server errors
      setErrors({
        email: true,
        password: true,
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-start min-h-screen bg-[#F9F8F6]">
        {/* Main container - responsive width */}
        <div className="flex justify-center w-full px-4 sm:px-8">
          {/* Form container - different widths for mobile/desktop */}
          <div className="flex flex-col items-center p-6 md:w-[800px] sm:p-12 md:p-16 lg:px-28 lg:py-16 my-8 sm:my-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl bg-[#EFEEEB] rounded-2xl">
            <h1 className="text-4xl font-semibold text-[#26231E] text-center mb-6 sm:mb-10">
              Log in
            </h1>

            <form
              onSubmit={handleSubmit}
              noValidate
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
                  className={`p-3 pl-4 border rounded-lg bg-white text-base font-medium focus:outline-none focus:ring-1 ${
                    errors.email
                      ? "border-[#EB5164] !text-[#EB5164] focus:ring-[#EB5164]"
                      : "border-[#DAD6D1] text-[#75716B] focus:ring-[#26231E]"
                  }`}
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
                  className={`p-3 pl-4 border rounded-lg bg-white text-base font-medium focus:outline-none focus:ring-1 ${
                    errors.password
                      ? "border-[#EB5164] text-[#EB5164] focus:ring-[#EB5164]"
                      : "border-[#DAD6D1] text-[#75716B] focus:ring-[#26231E]"
                  }`}
                />
              </div>
              
              <div className="flex justify-center">
                <button type="submit" className="btn btn-primary !w-[127px]">
                  Log in
                </button>
              </div>
              
              <div className="flex justify-center items-center gap-3 mt-2">
                <span className="text-base text-[#75716B]">
                  Don't have any account?
                </span>
                <a
                  onClick={() => navigate("/register")}
                  className="text-base font-medium text-[#26231E] underline hover:cursor-pointer"
                >
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
