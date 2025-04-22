import { Navbar } from "../components/ui/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your authentication logic here
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
                  className="p-3 pl-4 border border-[#DAD6D1] rounded-lg bg-white text-base font-medium text-[#75716B] focus:outline-none focus:ring-1 focus:ring-[#26231E]"
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
                  className="p-3 pl-4 border border-[#DAD6D1] rounded-lg bg-white text-base font-medium text-[#75716B] focus:outline-none focus:ring-1 focus:ring-[#26231E]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 py-3 px-10 bg-[#26231E] text-white font-medium rounded-full w-fit self-center hover:bg-[#3a3630] transition-colors"
              >
                Sign up
              </button>

              <div className="flex justify-center items-center gap-3 mt-2">
                <span className="text-base text-[#75716B]">
                  Already have an account?
                </span>
                <a
                  onClick={() => navigate("/login")}
                  className="text-base font-medium text-[#26231E] underline"
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

export default SignupPage;
