import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthenticationContext";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "@/styles/globals.css";
import LandingPage from "./pages/LandingPage";
import ViewPostPage from "./pages/ViewPostPage";
import { SignupPage, RegisterSuccess } from "./pages/Auth/SignupPage";
import LoginPage from "./pages/Auth/LoginPage";
import { ProfilePage, ResetPasswordPage } from "./pages/Auth/MemberManagement";
import { AdminLoginPage } from "./pages/AdminPages/AdminLoginPage";
import {
  ArticleManagement,
  CreateArticle,
  EditArticle,
  CategoryManagement,
  CreateCategory,
  EditCategory,
} from "./pages/AdminPages/ArticleManagement";
import { AdminProfileManagement } from "./pages/AdminPages/AdminProfilePage";
import { NotificationPage } from "./pages/AdminPages/NotificationPage";
import { AdminResetPasswordPage } from "./pages/AdminPages/AdminResetPassword";
import ScrollToTop from "@/utils/ScrollToTop";
import { ToastProvider } from "@/contexts/ToastProvider";
import { ToastContainer } from "@/components/ui/ToastAlert";

function App() {
  const { isAuthenticated, state } = useAuth();
  return (
    <div className="App">
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          {/* เส้นทางสาธารณะที่ทุกคนเข้าถึงได้ */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/posts/:postId" element={<ViewPostPage />} />

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
              <AdminProtectedRoute>
                <AdminProfileManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin-reset-password"
            element={
              <AdminProtectedRoute>
                <AdminResetPasswordPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/notification-page"
            element={
              <AdminProtectedRoute>
                <NotificationPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/create-category"
            element={
              <AdminProtectedRoute>
                <CreateCategory />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/edit-category/:categoryId"
            element={
              <AdminProtectedRoute>
                <EditCategory />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/category-management"
            element={
              <AdminProtectedRoute>
                <CategoryManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/edit-article/:articleId"
            element={
              <AdminProtectedRoute>
                <EditArticle />
              </AdminProtectedRoute>
            }
          /> 
          <Route
            path="/create-article"
            element={
              <AdminProtectedRoute>
                <CreateArticle />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/article-management"
            element={
              <AdminProtectedRoute>
                <ArticleManagement />
              </AdminProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer />
      </ToastProvider>
    </div>
  );
}

export default App;
