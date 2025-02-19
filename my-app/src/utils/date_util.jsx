export const calculateMonths = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.getMonth();  // 0 (1월) ~ 11 (12월)
  const endMonth = end.getMonth() + 1;  // 1 ~ 12월 (endMonth는 포함되는 마지막 달로 설정)

  return { startMonth, endMonth };
};