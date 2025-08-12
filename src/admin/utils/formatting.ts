export const formatNumberWithCommas = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) {
    return String(value); // Return original value if it's not a number (e.g., already has Naira sign)
  }
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const formatCurrency = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) {
    if (typeof value === 'string' && value.startsWith('₦')) {
      const numericPart = value.substring(1);
      const numberWithoutCommas = numericPart.replace(/,/g, '');
      const parsedNum = Number(numberWithoutCommas);
      if (!isNaN(parsedNum)) {
        return `₦${parsedNum.toLocaleString('en-US')}`;
      }
      return value;
    }
    return String(value);
  }
  return `₦${num.toLocaleString('en-US')}`;
};