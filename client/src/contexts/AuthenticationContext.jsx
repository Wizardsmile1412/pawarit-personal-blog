import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { supabase } from "@/api/supabaseClient"; // Add this import

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
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch user:", error.message);

      localStorage.removeItem("token");
      // Also clear Supabase session
      await supabase.auth.signOut();
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
      // Set the Supabase session with the stored token
      supabase.auth.setSession({
        access_token: token,
        refresh_token: localStorage.getItem("refresh_token") || "", // You might need to store this too
      });
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

      // Store the token
      localStorage.setItem("token", token);

      // IMPORTANT: Set Supabase session so RLS works
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: response.data.refresh_token || "", // Store refresh token if available
      });

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
      const response = await axiosInstance.post("/auth/register", data);

      // Check if user was auto-logged in
      if (response.data.access_token) {
        // Store tokens and set Supabase session
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        await supabase.auth.setSession({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        });

        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: null,
          user: response.data.user,
        }));
        navigate("/"); // Redirect to dashboard
      } else {
        // Email confirmation required
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: null,
        }));
        navigate("/register-success");
      }
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

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");

    // Sign out from Supabase as well
    await supabase.auth.signOut();

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
