export const useFormatDate = () => {
  // take date or date string and format it into a given string format
  const formatDate = (date, format='yyyy-mm-dd') => {
    if (!date) return null;
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    switch(format) {
      case 'dd-mm-yyyy':
      case 'dd/mm/yyyy':
        return `${day}-${month}-${year}`;
      case 'mm-dd-yyyy':
      case 'mm/dd/yyyy':
        return `${month}-${day}-${year}`;
      case 'yyyy-mm-dd':
      case 'yyyy/mm/dd':
        return `${year}-${month}-${day}`;
      case 'iso':
        return d.toISOString();
      default:
        return `${day}-${month}-${year}`;
    }
  }
  return { formatDate }
}
