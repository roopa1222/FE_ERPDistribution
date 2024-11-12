// utils.js or your utils file
export const applyFilter = ({ inputData, comparator, filterName }: any) => {
    if (!filterName) {
      return inputData;
    }
    
    return inputData.filter((row: any) => row.branchName.toLowerCase().includes(filterName.toLowerCase())).sort(comparator);
  };
  
  export const getComparator = (order: 'asc' | 'desc', orderBy: string) => order === 'desc'
      ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1);
  