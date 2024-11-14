import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { TableRow, TableCell, TableHead } from '@mui/material';

import { getApi } from 'src/service/api';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import {AddSalesMan} from './addSalesMan';
import { applyFilter, getComparator } from '../utils';
import { UserTableToolbar } from '../user-table-toolbar';


// ----------------------------------------------------------------------
export function UserView() {
  const table = useTable();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dashboardContent, setdashboardContent] = useState(true)
  const [data, setData] = useState<any[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 on rowsPerPage change
  };

  const handleClose = () => {
    setdashboardContent(true);
    setIsFormOpen(false);
};


const dataFiltered: any[] = applyFilter({
  inputData: data,
  comparator: getComparator(table.order, table.orderBy),
  filterName,
});

  const notFound = !dataFiltered.length && !!filterName;

  const handleButtonClick = () => {
    console.log('is form open')
    setIsFormOpen(!isFormOpen);
    setdashboardContent(!dashboardContent)
  };

  useEffect(() => {
    getAllUser();
  }, []);


  const getAllUser = async () => {
    try {
      const response = await getApi('/v1/auth/get-all-users');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error); // Handle any error
    }
  };

  console.log('data===', data)

  return (
    <>
       { dashboardContent && (
      <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleButtonClick}
        >
          New user
        </Button>
      </Box>
      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
            <TableHead>
                <TableRow>
                  {[
                    { id: 'SrNo.', label: 'SrNo.' },
                    { id: 'firstName', label: 'firstName' },
                    { id: 'lastName', label: 'lastName' },
                    { id: 'branchName', label: 'branchName' },
                    { id: 'role', label: 'role' },
                    { id: 'Status', label: 'Status' },
                    // { id: 'Delete', label: 'Delete' },
                  ].map((column) => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>

                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.lastName }</TableCell>
                      <TableCell>{row.branchId.branchName}</TableCell>
                      <TableCell>{row.role}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </DashboardContent>
    )}
    {isFormOpen && <AddSalesMan handleClose={handleClose} getAllUser={getAllUser} />}
    </>  
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
