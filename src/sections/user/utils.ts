
// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------


// utils.js or your utils file
export const applyFilter = ({ inputData, comparator, filterName }: any) => {
  if (!filterName) {
    return inputData;
  }
  
  return inputData.filter((row: any) => row.firstName.toLowerCase().includes(filterName.toLowerCase())).sort(comparator);
};

export const getComparator = (order: 'asc' | 'desc', orderBy: string) => order === 'desc'
    ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1);
