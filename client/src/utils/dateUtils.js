/**
 * Formats a date string or Date object to a readable format
 * @param {string|Date} dateInput - The date to format
 * @param {string} locale - The locale to use (default: "en-GB")
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (
  dateInput,
  locale = "en-GB",
  options = { day: "2-digit", month: "long", year: "numeric" }
) => {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date provided:", dateInput);
    return "";
  }
  
  return date.toLocaleDateString(locale, options);
};

/**
 * Formats a date to a short format (e.g., "25 Dec 2024")
 * @param {string|Date} dateInput - The date to format
 * @returns {string} Short formatted date string
 */
export const formatDateShort = (dateInput) => {
  return formatDate(dateInput, "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

/**
 * Formats a date to include time (e.g., "25 December 2024, 14:30")
 * @param {string|Date} dateInput - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateInput) => {
  return formatDate(dateInput, "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

/**
 * Formats a date for US format (e.g., "December 25, 2024")
 * @param {string|Date} dateInput - The date to format
 * @returns {string} US formatted date string
 */
export const formatDateUS = (dateInput) => {
  return formatDate(dateInput, "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} dateInput - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateInput) => {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};