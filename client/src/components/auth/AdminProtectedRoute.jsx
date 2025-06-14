import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "@/components/websection/PageContainer";

const AdminProtectedRoute = ({ children }) => {
  const { admin, state } = useAdminAuth();

  // Show loading while checking authentication
  if (state.getAdminLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin-login" replace />;
};

export default AdminProtectedRoute;
