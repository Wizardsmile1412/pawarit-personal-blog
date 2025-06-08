import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: false,
    getUserLoading: true,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axiosInstance.get("/auth/get-user");
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
        error: null, // Clear any previous errors
      }));
    } catch (error) {
      console.error("Failed to fetch user:", error.message);

      localStorage.removeItem("token");
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setState((prevState) => ({
        ...prevState,
        getUserLoading: false,
      }));
    }
  }, []);

  const login = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axiosInstance.post("/auth/login", data);
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/");
      await fetchUser();
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axiosInstance.post("/auth/register", data);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/register-success");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      const response = await axiosInstance.put(
        "/auth/reset-password",
        passwordData
      );
      console.log("Password change response:", response);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: null,
      }));

      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Password change failed";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({
      user: null,
      error: null,
      loading: false,
      getUserLoading: false,
    });
    navigate("/");
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        changePassword,
        isAuthenticated,
        fetchUser,
        user: state.user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
