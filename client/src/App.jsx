import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/authentication";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./assets/Global.css";
import LandingPage from "./pages/LandingPage";
import ViewPostPage from "./pages/ViewPostPage";
import { SignupPage, RegisterSuccess } from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ProfilePage, ResetPasswordPage } from "./pages/MemberManagement";
import { AdminLoginPage } from "./pages/AdminPages/AdminLoginPage";
import {
  ArticleManagement,
  CreateArticle,
  CategoryManagement,
  CreateCategory,
} from "./pages/AdminPages/ArticleManagement";
import { AdminProfileManagement } from "./pages/AdminPages/AdminProfilePage";
import { NotificationPage } from "./pages/AdminPages/NotificationPage";
import { AdminResetPasswordPage } from "./pages/AdminPages/AdminResetPassword";

function App() {
  const { isAuthenticated, state } = useAuth();
  return (
    <div className="App">
      <Routes>
        {/* เส้นทางสาธารณะที่ทุกคนเข้าถึงได้ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:postId" element={<ViewPostPage />} />

        {/* เส้นทางที่เฉพาะผู้ที่ยังไม่ล็อกอินเข้าถึงได้ */}
        <Route
          path="/register"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <SignupPage />
            </AuthenticationRoute>
          }
        />
        <Route
          path="/register-success"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <RegisterSuccess />
            </AuthenticationRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <LoginPage />
            </AuthenticationRoute>
          }
        />
        <Route
          path="/admin-login"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <AdminLoginPage />
            </AuthenticationRoute>
          }
        />

        {/* เส้นทางที่เฉพาะผู้ใช้ทั่วไปที่ล็อกอินแล้วเข้าถึงได้ */}
        <Route
          path="/member-profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="user"
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member-profile/reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="user"
            >
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        {/* เส้นทางที่เฉพาะผู้ดูแลระบบ (admin) เข้าถึงได้ */}
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminProfileManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification-page"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-category"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <CreateCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <CategoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-article"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <CreateArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <ArticleManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
