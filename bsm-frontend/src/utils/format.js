/**
 * Formats a number or string representing a number with dot thousand separators (e.g., 1000000 -> "1.000.000").
 */
export const formatNumberWithDots = (value) => {
  if (value === undefined || value === null || value === "") return "";
  // Remove any non-digits
  const cleanValue = value.toString().replace(/\D/g, "");
  if (!cleanValue) return "";
  // Add dot thousand separators
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Parses a dot-formatted number string back to a regular integer (e.g., "1.000.000" -> 1000000).
 */
export const parseNumberFromDots = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  const cleanValue = value.toString().replace(/\./g, "");
  return parseInt(cleanValue, 10) || 0;
};
