import type { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Table,
  Button,
  Popover,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  Autocomplete,
  TableContainer,
  TablePagination,
  Avatar,
  Modal,
  InputAdornment,
} from '@mui/material'; // Back icon

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the customer-like icon
import CurrencyRupee from '@mui/icons-material/CurrencyRupee';

import { getApi } from 'src/service/api';
import { DashboardContent } from 'src/layouts/dashboard';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { Iconify } from 'src/components/iconify';
import {AttachMoney,Receipt,AccountBalance} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import BalanceView from './balance-view';
import ExpensesView from '../expenses-view';
import DsrAddInvoiceView from '../add-dsr-invoice';
import ExpenseForm from '../expenses-form';
import BalanceForm from './balance-form';

interface Branch {
  _id: string;
  branchName: string;
}
interface PaymentDetail {
  mode: string;
  amount: number;
  _id?: string;
}

interface FinanceDetail {
  financeName: string;
  amount: number;
  _id?: string;
}

interface InvoiceRow {
  id: string | number;
  customerName: string;
  customerMobileNo: string;
  productName: string;
  category: string;
  totalAmount: number;
  createdAt: string;
  paymentMode: string[];
  [key: string]: any; // For additional properties
}
export function DsrInvoiceView() {
  const [addView, setAddView] = useState(false);
  const [expensesView, setExpesnesView] = useState(false);
  const [balanceView, setBalanceView] = useState(false);
  const [personName, setPersonName] = useState<string[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceRow[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [roleWiseAccess, setRoleWiseAccess] = useState(false);
  const [branchData, setBranchData] = useState<Branch[]>([]);
  const [customerMobileNo, setCustomerMobileNo] = useState<string>('NA');
  const [customerName, setCustomerName] = useState<string>('NA');
  const [paymentData, setPaymentData] = useState<PaymentDetail[]>([]);
  const [financeData, setFinanceData] = useState<FinanceDetail[]>([]);
  const [paymentAnchorEl, setPaymentAnchorEl] = useState<HTMLElement | null>(null);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [anchorElAdd, setAnchorElAdd] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openBalanceModal, setOpenBalanceModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Function to handle the opening of the payment details popover
  const handlePaymentClick = (event: React.MouseEvent<HTMLElement>, row: InvoiceRow) => {
    setPaymentAnchorEl(event.currentTarget);
    setPaymentData(row.paymentDetails);
    setFinanceData(row.financeDetails);
  };
  const getInvoiceData = useCallback(
    async (debounceValue:string,from: string, to: string, limit: number, offset: number) => {
      try {
        const response = await getApi(
          `/v1/dsrInvoice/dsr-invoice?branchId=${selectedBranchId}&searchValue=${debounceValue}&startDate=${from}&endDate=${to}&limit=${limit}&offset=${offset}`
        );
        // Handle the response as needed
        if (response.data) {
          setInvoiceData(response.data.dsrData.dsrData);

          setTotalCount(response.data.dsrData.dataCount);
        } else {
          setInvoiceData([]);
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    },
    [selectedBranchId]
  );

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'SALESMAN') {
      setRoleWiseAccess(true);
    } else {
      getBrachData();
    }
if(debouncedValue){
  
  getInvoiceData(debouncedValue,'', '', 5, 0);
}else{

  getInvoiceData('','', '', 5, 0);
}
  }, [getInvoiceData,debouncedValue]);

  useEffect(() => {

    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 700);

    return () => {
      clearTimeout(handler); // Clear timeout on value change
    };
  }, [searchValue]);


  const getBrachData = async () => {
    const response = await getApi('/v1/branch/all-branches');
    if (response) {
      setBranchData(response.data.data);
    }
  };

  const handleBranchChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: { _id: string; branchName: string } | null
  ) => {
    setSelectedBranchId(value ? value._id : '');
  };
  const handleAddInvoice = () => {
    setAddView(true);
  };

  const handleBack = () => {
    setAddView(false);
    getInvoiceData(debouncedValue,'', '', 5, 0);
    setStartDate('');
    setEndDate('');
  };

  const handleExpenses = () => {
    setExpesnesView(true);
  };

  const handleBalance = () => {
    setBalanceView(true);
  };
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    getInvoiceData(debouncedValue,startDate, endDate, rowsPerPage, newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to the first page when the rows per page changes
    getInvoiceData(debouncedValue,startDate, endDate, newRowsPerPage, 0);
  };

  // Apply filtering when the user clicks "Search"
  const handleSearch = () => {
    getInvoiceData(debouncedValue,startDate, endDate, rowsPerPage, 0);
  };

  // Reset filters and inputs
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleDsrInvoiceExcel = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.get(
        `http://localhost:3002/v1/dsrInvoice/dsr-invoice-excel-data?branchId=${selectedBranchId}&startDate=${startDate}&endDate=${endDate}`,
        { responseType: 'blob' ,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        } // Ensures the response is treated as binary data
      );
  
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DsrInvoice_${startDate}_to_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: InvoiceRow) => {
    setAnchorEl(event.currentTarget);
    setCustomerName(row.customerName || 'NA');
    setCustomerMobileNo(row.customerMobileNo);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCustomerName('');
    setCustomerMobileNo(' ');
    setPaymentAnchorEl(null);
    setAnchorElAdd(null);
  };

  const opens = Boolean(anchorElAdd);
  const handleClickAdd = (event: React.MouseEvent<HTMLElement>) => {
    
    setAnchorElAdd(event.currentTarget);
  };
  
  const handleOpenExpenseModal = () => setOpenExpenseModal(true);
  const handleCloseExpenseModal = () => setOpenExpenseModal(false);

  const handleOpenBalanceModal = () => setOpenBalanceModal(true);
  const handleCloseBalanceModal = () => setOpenBalanceModal(false);

  const openPaymentPopover = Boolean(paymentAnchorEl);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <DashboardContent>
      {!expensesView && !balanceView && !addView && (
        <Box display="flex" alignItems="center" mb={5} gap={2}>
          <Typography variant="h4" flexGrow={1}>
            DSR-INVOICE
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="mingcute:eye-line" />}
            onClick={handleBalance}
          >
            Balances
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="mingcute:eye-line" />}
            onClick={handleExpenses}
          >
            Expenses
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            // onClick={handleAddInvoice}
            onClick={handleClickAdd}
            aria-controls={opens ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={opens ? 'true' : undefined}
          >
            Add
          </Button>
          <Menu
        anchorEl={anchorElAdd}
        id="account-menu"
        open={opens}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider /> */}
        <MenuItem onClick={handleAddInvoice}>
          <ListItemIcon>
            <Receipt fontSize="small" />
          </ListItemIcon>
           Invoice
        </MenuItem>
        <MenuItem onClick={handleOpenBalanceModal}>
          <ListItemIcon>
            <AccountBalance fontSize="small" />
          </ListItemIcon>
           Balance
        </MenuItem>
        <MenuItem onClick={handleOpenExpenseModal}>
          <ListItemIcon>
            <AttachMoney fontSize="small" />
          </ListItemIcon>
           Expense
        </MenuItem>
      </Menu>
    
        </Box>
      )}

      <Card>
        {addView && !expensesView && !balanceView && (
          <Box p={2}>
            <Box display="flex" alignItems="center" mb={5} gap={2}>
              {/* Back Icon */}
              <IconButton>
                <ArrowBackIcon onClick={handleBack} />
              </IconButton>

              {/* Centered Title */}
              <Typography variant="h4" flexGrow={1} textAlign="center">
                Create Invoice
              </Typography>
            </Box>
            {/* Add fields and components here for the invoice form */}

            <DsrAddInvoiceView />
          </Box>
        )}

        {!addView && !expensesView && !balanceView && (
          <Box p={2}>
            <Typography variant="body1">
              <Box p={3}>
                {/* Toolbar */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  {/* Search Input Box with Search Icon */}
  <Box display="flex" alignItems="center" sx={{ flex: 1, maxWidth: '470px' }}>
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Search products, categories, or payment options..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      fullWidth
    />
  </Box>

  {/* Export to Excel Button */}
  <Button variant="contained" color="inherit" onClick={handleDsrInvoiceExcel}>
    Export to Excel
  </Button>
</Box>

                <Box display="flex" flexDirection="column" gap={2} mb={3}>
                  {/* Filters */}
                  <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                    {/* Branch Autocomplete */}
                    {!roleWiseAccess && (
                      <Autocomplete
                        options={branchData}
                        getOptionLabel={(option) => option.branchName}
                        size="small"
                        isOptionEqualToValue={(option, value) => value && option._id === value._id}
                        onChange={(event, value) => setSelectedBranchId(value ? value._id : '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Branch"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                        sx={{ flex: 1, minWidth: '200px' }}
                      />
                    )}

                    {/* Start Date */}
                    <TextField
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={startDate}
                      size="small"
                      onChange={(e) => setStartDate(e.target.value)}
                      error={Boolean(
                        startDate && endDate && new Date(startDate) > new Date(endDate)
                      )}
                      helperText={
                        startDate && endDate && new Date(startDate) > new Date(endDate)
                          ? 'Start date cannot be after end date'
                          : ''
                      }
                      variant="outlined"
                      sx={{ flex: 1, minWidth: '150px' }}
                    />

                    {/* End Date */}
                    <TextField
                      label="End Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ flex: 1, minWidth: '150px' }}
                    />

                    {/* Search Button */}
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={handleSearch}
                      disabled={!startDate || !endDate || new Date(startDate) > new Date(endDate)}
                      // sx={{ height: '56px' }}
                      // size="small"
                    >
                      Search
                    </Button>
                  </Box>
                </Box>

                {/* Table */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sr.No</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Category</TableCell>
                       { !roleWiseAccess && <TableCell>Branch Name</TableCell>}
                        <TableCell>Customer Details</TableCell>
                        <TableCell>Payment Mode</TableCell>
                        <TableCell>Payment Details</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        {/* <TableCell>Action</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
      {invoiceData && invoiceData.length > 0 ? (
        invoiceData.map((row, index) => {
          // Calculate serial number
          const serialNumber = page * rowsPerPage + index + 1;
          return (
            <TableRow key={row._id}>
              <TableCell>{serialNumber}</TableCell> {/* Updated Serial Number Calculation */}
              <TableCell>{row.productName}</TableCell>
              <TableCell>{row.category}</TableCell>
              { !roleWiseAccess &&
              <TableCell>{row.branchName}</TableCell>
              }
              <TableCell
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconButton onClick={(e) => handleClick(e, row)}>
                  <PersonIcon />
                </IconButton>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <Typography
                      variant="caption"
                      component="span"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Customer Name :
                    </Typography>{' '}
                    {customerName || 'NA'}
                    <br />
                    <Typography
                      variant="caption"
                      component="span"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Customer Mobile :
                    </Typography>{' '}
                    {customerMobileNo || 'NA'}
                  </Typography>
                </Popover>
              </TableCell>
              <TableCell>
                {Array.isArray(row.paymentMode)
                  ? row.paymentMode.join(', ')
                  : row.paymentMode}
              </TableCell>
              <TableCell
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconButton onClick={(e) => handlePaymentClick(e, row)}>
                  <VisibilityIcon />
                </IconButton>
                <Popover
                  id={id}
                  open={openPaymentPopover}
                  anchorEl={paymentAnchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    {paymentData &&
                      paymentData.map(
                        (detail: PaymentDetail) =>
                          detail.mode !== '2Finance' &&
                          detail.mode !== '1Finance' && (
                            <div key={detail.mode}>
                              <Typography
                                variant="caption"
                                component="span"
                                sx={{ fontWeight: 'bold' }}
                              >
                                {detail.mode} =
                              </Typography>{' '}
                              <CurrencyRupee
                                fontSize="small"
                                style={{ fontSize: '0.8rem' }}
                              />{' '}
                              {detail.amount}
                            </div>
                          )
                      )}

                    {financeData &&
                      financeData.map((detail: FinanceDetail) => (
                        <div key={detail.financeName}>
                          <Typography
                            variant="caption"
                            component="span"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {detail.financeName} =
                          </Typography>{' '}
                          <CurrencyRupee
                            fontSize="small"
                            style={{ fontSize: '0.8rem' }}
                          />{' '}
                          {detail.amount}
                        </div>
                      ))}
                  </Typography>
                </Popover>
              </TableCell>

              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CurrencyRupee
                    fontSize="small"
                    style={{ fontSize: '1rem', marginRight: '4px' }}
                  />
                  {row.totalAmount}
                </div>
              </TableCell>

              <TableCell>{row.createdAt}</TableCell>
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell colSpan={6} align="center">
            No Data Found!
          </TableCell>
        </TableRow>
      )}
    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box>
            </Typography>
          </Box>
        )}
      </Card>

      {expensesView && !addView && !balanceView && (
        <ExpensesView expensesDataView={expensesView} handleBack={() => setExpesnesView(false)} />
      )}

      {balanceView && !addView && !expensesView && (
        <BalanceView balanceDataView={balanceView} handleBack={() => setBalanceView(false)} />
      )}

       {/* Expense Modal */}
       <Modal open={openExpenseModal} onClose={handleCloseExpenseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <ExpenseForm onClose={handleCloseExpenseModal} />
        </Box>
      </Modal>

      {/* Balance Modal  */}
      <Modal open={openBalanceModal} onClose={handleCloseBalanceModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <BalanceForm onClose={handleCloseBalanceModal} /> {/* Render BalanceForm */}
        </Box>
      </Modal>
    </DashboardContent>
  );
}
