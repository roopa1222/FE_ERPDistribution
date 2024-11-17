import { Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography,IconButton, TableContainer, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back icon
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import {Iconify} from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import Card from '@mui/material/Card';
import LoadingButton from '@mui/lab/LoadingButton';
import  DsrAddInvoiceView  from '../add-dsr-invoice';
import ExpensesView from '../expenses-view';
import BalanceView from './balance-view';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
    'UPI',
    'Debit',
    'Credit',
    'Cash',
    'Pending',
    '2Finance'
  ];

export function DsrInvoiceView() {
  const [addView, setAddView] = useState(false);
  const [expensesView, setExpesnesView] = useState(false);
  const [balanceView, setBalanceView] = useState(false);
  const [personName, setPersonName] = useState<string[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const handleAddInvoice = () => {
    setAddView(true);
  };

  const handleBack = () => {
    setAddView(false);
  }

  const handleExpenses = () => {
    setExpesnesView(true);
  }

  const handleBalance = () => {
    setBalanceView(true);
  }
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const renderForm = (
<Box display="flex" flexDirection="column" alignItems="center"  mt={3}>
  <Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        name="product"
        label="Product Name"
      />
    </Grid>
    <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
        <InputLabel id="demo-multiple-checkbox-label">Payment Mode</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Payment Mode" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        name="customerName"
        label="Customer Name"
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        name="CustomerMobileNo"
        label="Customer Mobile No"
      />
    </Grid>
  </Grid>

  <LoadingButton
    size="large"
    type="submit"
    color="inherit"
    variant="contained"
    sx={{ alignSelf: 'center' }}
  >
    Save
  </LoadingButton>
</Box>
    );
  

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  
    // Sample data for the table
    const rows = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      name: `Item ${index + 1}`,
      date: `2024-11-${String(index + 1).padStart(2, "0")}`,
      amount: (index + 1) * 100,
    }));
  
    // Handle pagination
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

      // Apply filtering when the user clicks "Search"
  const handleSearch = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const result = rows.filter((row) => {
      const rowDate = new Date(row.date);
      return (
        (!start || rowDate >= start) &&
        (!end || rowDate <= end)
      );
    });

    setFilteredRows(result);
    setPage(0); // Reset pagination
  };

    // Initialize filtered rows with full data
    useEffect(() => {
        setFilteredRows(rows);
      }, [rows]);
    

  // Reset filters and inputs
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilteredRows(rows); // Reset to all rows
  };
  
    // Export to Excel (stub function)
    const handleExportToExcel = () => {
      alert("Export to Excel functionality not yet implemented!");
    };

  return (
    <DashboardContent>
      {!expensesView &&  !balanceView && !addView &&
      <Box display='flex' alignItems='center' mb={5} gap={2}>
        <Typography variant='h4' flexGrow={1}>
          DSR-INVOICE
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<Iconify icon='mingcute:eye-line' />}
          onClick={handleBalance}
        >
        Balances
        </Button>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<Iconify icon='mingcute:eye-line' />}
          onClick={handleExpenses}
        >
        Expenses
        </Button>

        <Button
          variant='contained'
          color='inherit'
          startIcon={<Iconify icon='mingcute:add-line' />}
          onClick={handleAddInvoice}
        >
          Add Invoice
        </Button>
      </Box>}

      <Card>
        {addView && !expensesView && !balanceView &&
        <Box p={2}>
        {/* <Typography variant='h6'>Create Invoice</Typography> */}
        <Box display="flex" alignItems="center" mb={5} gap={2}>
      {/* Back Icon */}
      <IconButton >
        <ArrowBackIcon  onClick={handleBack}/>
      </IconButton>

      {/* Centered Title */}
      <Typography variant="h4" flexGrow={1} textAlign="center">
      Create Invoice
      </Typography>

      {/* Add Expenses Button */}
      {/* <Button variant="contained" color="inherit" onClick={handleOpenModal}>
        Add Expenses
      </Button> */}
    </Box>
        {/* Add fields and components here for the invoice form */}

        <DsrAddInvoiceView/>

      </Box>
        } 

        {!addView && !expensesView && !balanceView &&
          <Box p={2}>
            <Typography variant='body1'>
            <Box p={3}>
      {/* Toolbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* Left Side: Date Inputs */}
        <Box display="flex" gap={2}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
                    <Button
            variant="contained"
            color="inherit"
            onClick={handleSearch}
            disabled={!startDate || !endDate} // Disable if dates are not selected
          >
            Search
          </Button>
          {/* <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
          >
            Clear
          </Button> */}
        </Box>

        {/* Right Side: Export Button */}
        <Button
          variant="contained"
          color="inherit"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Box>
            </Typography>
          </Box>

        }
      </Card>
      
      {
            expensesView &&  !addView && !balanceView && 
            <ExpensesView expensesDataView={expensesView} handleBack={() => setExpesnesView(false)}/>
        }

{
            balanceView &&  !addView &&  !expensesView &&
            <BalanceView balanceDataView={balanceView} handleBack={() => setBalanceView(false)}/>
        }
    </DashboardContent>
  );
}
