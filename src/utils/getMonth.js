export const getMonthName = (monthNumber) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthNumber - 1] || "";
  };

  export  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };