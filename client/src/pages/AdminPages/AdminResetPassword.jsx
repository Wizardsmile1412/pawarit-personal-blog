import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

export function AdminResetPasswordPage() {
  // State for form fields
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for form submission and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API integration
      // const response = await apiClient.post('/reset-password', formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set success state
      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      // Handle API errors
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 py-6 px-20 flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Reset password</h1>
          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gray-900 text-white px-8 py-2 rounded-full shadow-md ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </button>
          </div>
        </header>

        <div className="px-20 py-6">
          <form onSubmit={handleSubmit} className="w-120">
            {/* Current Password Field */}
            <div className="mb-6">
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
              />
            </div>

            {/* New Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">New password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="New password"
              />
            </div>

            {/* Confirm New Password Field */}
            <div className="mb-6">
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
              />
            </div>
          </form>

          {/* Success message */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
              Password reset successfully!
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
