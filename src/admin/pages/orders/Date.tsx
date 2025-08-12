const formatEstimatedDelivery = (estimated: string): string => {
    try {
      const dates: string[] = JSON.parse(estimated.replace(/'/g, '"'));
      const formattedDates = dates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      });
      return `${formattedDates.join(' - ')}`;
    } catch (e) {
        
      
      return "Estimated delivery: N/A";
    }
  };

  export default formatEstimatedDelivery