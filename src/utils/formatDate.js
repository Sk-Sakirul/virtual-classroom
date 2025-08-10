// Date formatting utilities for the Virtual Classroom app

/**
 * Format a date for display in chat messages
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Less than a minute ago
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Less than an hour ago
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // Less than a day ago
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // Less than a week ago
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // More than a week ago - show actual date
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: dateObj.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

/**
 * Format a date for display in chat messages with time
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const isToday = dateObj.toDateString() === now.toDateString();
  const isYesterday =
    dateObj.toDateString() ===
    new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

  const timeString = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return timeString;
  }

  if (isYesterday) {
    return `Yesterday ${timeString}`;
  }

  return `${dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} ${timeString}`;
};

/**
 * Format a date for file timestamps
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatFileDate = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format session duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string (e.g., "1:23:45")
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Get relative time string (e.g., "2 minutes ago", "in 5 hours")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((dateObj - now) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const count = Math.floor(absDiff / unit.seconds);
    if (count >= 1) {
      const plural = count > 1 ? "s" : "";
      const timePhrase = `${count} ${unit.name}${plural}`;
      return diffInSeconds >= 0 ? `in ${timePhrase}` : `${timePhrase} ago`;
    }
  }

  return "just now";
};

/**
 * Format date for chart labels
 * @param {Date|string} date - Date to format
 * @param {string} timeRange - Time range context ('hour', 'day', 'week', 'month')
 * @returns {string} Formatted date string for charts
 */
export const formatChartDate = (date, timeRange = "hour") => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  switch (timeRange) {
    case "hour":
      return dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });

    case "day":
      return dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

    case "week":
      return dateObj.toLocaleDateString("en-US", {
        weekday: "short",
      });

    case "month":
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    default:
      return dateObj.toLocaleDateString("en-US");
  }
};

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is within the last N minutes
 * @param {Date|string} date - Date to check
 * @param {number} minutes - Number of minutes
 * @returns {boolean} True if date is within the last N minutes
 */
export const isWithinLastMinutes = (date, minutes = 5) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInMinutes = (now - dateObj) / (1000 * 60);

  return diffInMinutes <= minutes && diffInMinutes >= 0;
};

export default {
  formatDate,
  formatDateTime,
  formatFileDate,
  formatDuration,
  getRelativeTime,
  formatChartDate,
  isToday,
  isWithinLastMinutes,
};
