export const formatNumberWithCommas = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) {
    return String(value); // Return original value if it's not a number (e.g., already has Naira sign)
  }
  return num.toLocaleString('en-US');
};

export const formatCurrency = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) {
    // Check if the value already starts with Naira sign
    if (typeof value === 'string' && value.startsWith('₦')) {
      const numericPart = value.substring(1);
      const numberWithoutCommas = numericPart.replace(/,/g, '');
      const parsedNum = Number(numberWithoutCommas);
      if (!isNaN(parsedNum)) {
        return `₦${parsedNum.toLocaleString('en-US')}`;
      }
      return value; // Return as is if parsing fails
    }
    return String(value); // Return original value if it's not a number and not a pre-formatted Naira string
  }
  return `₦${num.toLocaleString('en-US')}`;
}; 