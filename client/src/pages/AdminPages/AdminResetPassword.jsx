import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "@/components/websection/AdminSidebar";
import { useToast } from "@/hooks/useToast";

export function AdminResetPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { resetPassword } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showError("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showError("New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 6) {
      showError("New password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        showSuccess(result.message || "Password reset successfully!");

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

      } else if (result.error) {
        showError(result.error);
      }
    } catch (err) {
      // Handle unexpected errors
      const errorMessage =
        err.message || "Failed to reset password. Please try again.";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-[var(--color-background)] border-b border-gray-200 py-6 px-20 flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Reset password</h1>
          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`bg-gray-900 text-white px-8 py-2 rounded-full shadow-md transition-colors ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-gray-800 hover:cursor-pointer"
              }`}
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </button>
          </div>
        </header>

        <div className="px-20 pt-10 pb-30">
          {/* Success Message */}

          <form
            onSubmit={handleSubmit}
            className="w-120 flex flex-col gap-[28px]"
          >
            {/* Current Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block text-gray-700 mb-2">
                Current password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Current password"
                disabled={isSubmitting}
              />
            </div>

            {/* New Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block text-gray-700 mb-2">New password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="New password (minimum 6 characters)"
                disabled={isSubmitting}
              />
            </div>

            {/* Confirm New Password Field */}
            <div className="flex flex-col gap-1">
              <label className="block text-gray-700 mb-2">
                Confirm new password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Confirm new password"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit button for form submission (hidden, handled by header button) */}
            <button type="submit" style={{ display: "none" }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
