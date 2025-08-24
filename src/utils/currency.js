// Currency utility functions

// Convert USD to INR (using approximate rate of 1 USD = 83 INR)
export const convertUSDToINR = (usdAmount) => {
  return Math.round(usdAmount * 83);
};

// Format price in INR with proper formatting
export const formatINR = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Format price in USD with proper formatting
export const formatUSD = (amount) => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Smart price formatter - detects if price is in USD or INR and formats accordingly
export const formatPrice = (amount) => {
  // If amount is less than 1000, assume it's USD and convert to INR
  if (amount < 1000) {
    return formatINR(convertUSDToINR(amount));
  }
  // Otherwise, assume it's already in INR
  return formatINR(amount);
};

// Get current exchange rate (you can update this periodically)
export const getExchangeRate = () => {
  return 83; // 1 USD = 83 INR (approximate)
};
