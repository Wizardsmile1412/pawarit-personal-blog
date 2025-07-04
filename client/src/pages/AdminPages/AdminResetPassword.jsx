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
  const [showModal, setShowModal] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Separate validation logic
  const validateForm = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showError("All fields are required");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showError("New passwords don't match");
      return false;
    }

    if (formData.newPassword.length < 6) {
      showError("New password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  // Main reset logic - always validate before performing reset
  const performPasswordReset = async () => {
    // Always validate before performing the reset
    if (!validateForm()) {
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
      setShowModal(false);
    } catch (err) {
      const errorMessage =
        err.message || "Failed to reset password. Please try again.";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form submit handler - validate and show modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate and show modal if valid
    if (validateForm()) {
      setShowModal(true);
    }
  };

  // Modal confirm handler - performs the actual reset (validation happens inside performPasswordReset)
  const handleConfirmReset = async () => {
    await performPasswordReset();
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
              onClick={() => {
                // Validate before showing modal
                if (validateForm()) {
                  setShowModal(true);
                }
              }}
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

            {/* Reset Password Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-[var(--color-brown-100)] flex flex-col rounded-xl pt-4 pb-10 px-6 shadow-lg w-[480px] text-center">
                  <div className="flex justify-end">
                    <button
                      onClick={handleCancel}
                      className="text-[var(--color-brown-600)] text-2xl hover:text-gray-600 hover:cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    <h3 className="text-2xl font-semibold text-[var(--color-brown-600)]">
                      Reset Password
                    </h3>
                    <p className="text-base text-[var(--color-brown-400)]">
                      Do you want to reset your password?
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="bg-white border border-[var(--color-brown-400)] text-[var(--color-brown-600)] py-3 px-10 rounded-full hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmReset}
                        disabled={isSubmitting}
                        className="bg-[var(--color-brown-600)] text-white py-3 px-10 rounded-full hover:bg-[var(--color-brown-400)] hover:cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
