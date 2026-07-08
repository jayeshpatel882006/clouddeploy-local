// ==========================================
// Format Utilities
// ==========================================

/**
 * Format bytes into a human-readable string (KB, MB, GB).
 *
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places (default 1)
 * @returns {string} e.g. "273.2 MB"
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));

  return `${value} ${sizes[i]}`;
};

/**
 * Shorten an image ID (SHA256 digest) to a short display form.
 * e.g. "sha256:91ab2389ab87ef82d..." → "91ab2389..."
 *
 * @param {string} imageId - Full image ID or digest
 * @param {number} chars - Number of characters to keep (default 8)
 * @returns {string} Shortened ID
 */
export const shortenImageId = (imageId, chars = 8) => {
  if (!imageId) return "";
  // Remove "sha256:" prefix if present
  const clean = imageId.replace(/^sha256:/, "");
  if (clean.length <= chars) return clean;
  return `${clean.slice(0, chars)}...`;
};

/**
 * Format an ISO date string into a human-readable format.
 * Uses a provided timezone string (e.g. "Asia/Kolkata") or falls back to local timezone.
 *
 * @param {string} isoString - ISO date string
 * @param {string} [timezone] - IANA timezone (e.g. "Asia/Kolkata")
 * @returns {string} e.g. "08 Jul 2026  09:30 AM"
 */
export const formatDate = (isoString, timezone) => {
  if (!isoString) return "—";

  try {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone || undefined,
    };

    return date.toLocaleDateString("en-US", options).replace(/,/g, "");
  } catch {
    return "—";
  }
};

/**
 * Format a date to show just the date portion.
 *
 * @param {string} isoString - ISO date string
 * @param {string} [timezone] - IANA timezone
 * @returns {string} e.g. "08 Jul 2026"
 */
export const formatShortDate = (isoString, timezone) => {
  if (!isoString) return "—";

  try {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: timezone || undefined,
    };

    return date.toLocaleDateString("en-US", options);
  } catch {
    return "—";
  }
};

/**
 * Get relative time string from an ISO date.
 *
 * @param {string} isoString - ISO date string
 * @returns {string} e.g. "2 hours ago", "Just now", "5 days ago"
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return "";

  const now = Date.now();
  const date = new Date(isoString).getTime();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return formatShortDate(isoString);
};
