export const calculateActiveMonths = (startDate, term) => {
    const startMonth = new Date(startDate).getMonth();
    const termInMonths = Math.ceil(parseInt(term) / 30);
    const endMonth = Math.min(startMonth + termInMonths, 12);
    return { startMonth, endMonth };
  };