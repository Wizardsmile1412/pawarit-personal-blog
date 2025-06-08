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
        admin: adminUser 
      }));
      
      navigate("/admin-profile");
      
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
      const token = localStorage.getItem("adminToken");
      if (token) {
        await axiosInstance.post("/admin/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      setState({
        admin: null,
        error: null,
        loading: false,
        getAdminLoading: false,
      });
      navigate("/admin-login");
    }
  };

  const isAdminAuthenticated = Boolean(state.admin);

  return (
    <AdminAuthContext.Provider
      value={{
        state,
        adminLogin,
        adminLogout,
        isAdminAuthenticated,
        fetchAdmin,
        admin: state.admin,
        loading: state.loading,
        error: state.error,
      }}
    >
      {props.children}
    </AdminAuthContext.Provider>
  );
}

const useAdminAuth = () => React.useContext(AdminAuthContext);

export { AdminAuthProvider, useAdminAuth };