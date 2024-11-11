
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { TableRow, TableCell, TableHead, IconButton, TablePagination } from '@mui/material';

import { getApi } from 'src/service/branchApi';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';




// ----------------------------------------------------------------------

export function BranchView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<any[]>([]);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 on rowsPerPage change
  };

  const handleEdit = (e: any) => {
    console.log('Editing:');

  };

  const handleDelete = () => {
    console.log('Deleting:',);

  };

  useEffect(() => {
    getAllBranch();
  }, []);

  const getAllBranch = async () => {
    try {
      const response = await getApi('/v1/branch/all-branches');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error); // Handle any error
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Branch
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Add Branch
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {[
                    { id: 'SrNo.', label: 'SrNo.' },
                    { id: 'BranchName', label: 'BranchName' },
                    { id: 'BranchManager', label: 'BranchManager' },
                    { id: 'Edit', label: 'Edit' },
                    // { id: 'Delete', label: 'Delete' },
                  ].map((column) => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>

                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.branchName}</TableCell>
                      <TableCell>{ }</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleEdit(e)}>
                          <Iconify icon="solar:pen-bold" sx={{ color: '#1976D2' }}/> {/* Edit icon */}
                        </IconButton>
                      </TableCell>
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
  );
}
