import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";

const AdminAuthContext = React.createContext();

function AdminAuthProvider(props) {
  const [state, setState] = useState({
    loading: false,
    getAdminLoading: true,
    error: null,
    admin: null,
    profile: null,
    profileLoading: false,
  });

  const navigate = useNavigate();

  const fetchAdmin = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        admin: null,
        getAdminLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getAdminLoading: true }));
      const response = await axiosInstance.get("/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState((prevState) => ({
        ...prevState,
        admin: response.data.user,
        getAdminLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch admin:", error.message);

      localStorage.removeItem("adminToken");
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        admin: null,
        getAdminLoading: false,
      }));
    }
  };

  const getAdminProfile = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      return { error: "No authentication token found" };
    }

    try {
      setState((prevState) => ({ ...prevState, profileLoading: true }));

      const response = await axiosInstance.get("/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState((prevState) => ({
        ...prevState,
        profile: response.data.user,
        profileLoading: false,
        error: null,
      }));

      return { success: true, profile: response.data.user };
    } catch (error) {
      console.error("Failed to fetch admin profile:", error.message);
      const errorMessage =
        error.response?.data?.error || "Failed to fetch profile";

      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
        profileLoading: false,
      }));

      return { error: errorMessage };
    }
  };

  const updateAdminProfile = async (profileData) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      return { error: "No authentication token found" };
    }

    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      const response = await axiosInstance.put(
        "/admin/update-profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState((prevState) => ({
        ...prevState,
        profile: response.data.user,
        loading: false,
        error: null,
      }));

      return {
        success: true,
        profile: response.data.user,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Failed to update admin profile:", error.message);
      const errorMessage =
        error.response?.data?.error || "Failed to update profile";

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));

      return { error: errorMessage };
    }
  };

  const uploadProfilePicture = async (formData) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      return { error: "No authentication token found" };
    }

    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      const response = await axiosInstance.post(
        "/admin/upload-profile-pic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setState((prevState) => ({
        ...prevState,
        profile: response.data.user,
        loading: false,
        error: null,
      }));

      return { success: true, profile: response.data.user };
    } catch (error) {
      console.error("Failed to upload profile picture:", error.message);
      const errorMessage =
        error.response?.data?.error || "Failed to upload profile picture";

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));

      return { error: errorMessage };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      fetchAdmin();
    } else {
      setState((prevState) => ({
        ...prevState,
        getAdminLoading: false,
      }));
    }
  }, []);

  const adminLogin = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      const response = await axiosInstance.post("/admin/login", data);
      const token = response.data.access_token;
      const adminUser = response.data.user;

      localStorage.setItem("adminToken", token);

      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: null,
        admin: adminUser,
      }));

      navigate("/article-management");

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Admin login failed";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  const adminLogout = async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const token = localStorage.getItem("adminToken");
      if (token) {
        await axiosInstance.post(
          "/admin/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      setState({
        admin: null,
        profile: null,
        error: null,
        loading: false,
        getAdminLoading: false,
        profileLoading: false,
      });
      navigate("/admin-login");
    }
  };

  const resetPassword = async (passwordData) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const token = localStorage.getItem("adminToken");
      let response;
      if (token) {
        response = await axiosInstance.put(
          "/admin/reset-password",
          passwordData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

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

  const isAdminAuthenticated = Boolean(state.admin);

  return (
    <AdminAuthContext.Provider
      value={{
        state,
        adminLogin,
        adminLogout,
        resetPassword,
        getAdminProfile,
        updateAdminProfile,
        uploadProfilePicture,
        isAdminAuthenticated,
        fetchAdmin,
        admin: state.admin,
        profile: state.profile,
        loading: state.loading,
        profileLoading: state.profileLoading,
        error: state.error,
      }}
    >
      {props.children}
    </AdminAuthContext.Provider>
  );
}

const useAdminAuth = () => React.useContext(AdminAuthContext);

export { AdminAuthProvider, useAdminAuth };
