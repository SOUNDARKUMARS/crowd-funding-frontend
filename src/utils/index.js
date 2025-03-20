export const daysLeft = (deadline) => {
  // Parse YYYY-MM-DD format
  const [year, month, day] = deadline?.split("-").map(Number);
  const deadlineDate = new Date(year, month - 1, day); // month is 0-indexed

  const difference = deadlineDate.getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const formatAmount = (amount) => {
  // Remove commas and convert to number
  const num =
    typeof amount === "string" ? parseFloat(amount.replace(/,/g, "")) : amount;

  // Convert to absolute value for comparison
  const absNum = Math.abs(num);

  // Format based on value ranges
  if (absNum >= 10000000) {
    // 1 crore = 10000000
    return `${(num / 10000000).toFixed(2)}Cr`;
  } else if (absNum >= 100000) {
    // 1 lakh = 100000
    return `${(num / 100000).toFixed(2)}L`;
  } else if (absNum >= 1000) {
    // 1 thousand = 1000
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
};
