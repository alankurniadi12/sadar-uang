export const getMonthDateRange = (month, year) => {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  return {
    startDate,
    endDate,
  };
};

export const getYearDateRange = (year) => {
  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year + 1, 0, 1));

  return {
    startDate,
    endDate,
  };
};
