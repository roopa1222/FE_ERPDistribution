import type { SelectChangeEvent } from '@mui/material';

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

import { Iconify } from 'src/components/iconify';

import BalanceView from './balance-view';
import ExpensesView from '../expenses-view';
import DsrAddInvoiceView from '../add-dsr-invoice';

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

  // Function to handle the opening of the payment details popover
  const handlePaymentClick = (event: React.MouseEvent<HTMLElement>, row: InvoiceRow) => {
    setPaymentAnchorEl(event.currentTarget);
    setPaymentData(row.paymentDetails);
    setFinanceData(row.financeDetails);
  };
  const getInvoiceData = useCallback(
    async (from: string, to: string, limit: number, offset: number) => {
      try {
        const response = await getApi(
          `/v1/dsrInvoice/dsr-invoice?branchId=${selectedBranchId}&startDate=${from}&endDate=${to}&limit=${limit}&offset=${offset}`
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
    getInvoiceData('', '', 5, 0);
  }, [getInvoiceData]);

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
    getInvoiceData('', '', 5, 0);
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
    getInvoiceData(startDate, endDate, rowsPerPage, newPage * rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to the first page when the rows per page changes
    getInvoiceData(startDate, endDate, newRowsPerPage, 0);
  };

  // Apply filtering when the user clicks "Search"
  const handleSearch = () => {
    getInvoiceData(startDate, endDate, rowsPerPage, 0);
  };

  // Reset filters and inputs
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
  };

  // Export to Excel (stub function)
  const handleDsrInvoiceExcel = async () => {
    const response = await getApi(
      `/v1/dsrInvoice/dsr-invoice-excel-data?branchId=${selectedBranchId}&from=${startDate}&to=${endDate}`
    );
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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
  };

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
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:eye-line" />}
            onClick={handleBalance}
          >
            Balances
          </Button>
          <Button
            variant="contained"
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
            onClick={handleAddInvoice}
          >
            Add Invoice
          </Button>
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
                <Box display="flex" flexDirection="row" justifyContent="flex-end" mb={2}>
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
                        <TableCell>Customer Details</TableCell>
                        <TableCell>Payment Mode</TableCell>
                        <TableCell>Payment Details</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceData && invoiceData.length > 0 ? (
                        invoiceData.map((row, index) => (
                          <TableRow key={row._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.productName}</TableCell>
                            <TableCell>{row.category}</TableCell>
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
                                      <div>
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
                            <TableCell>
                              <IconButton
                                aria-label="more"
                                aria-controls={`menu-${row.id}`}
                                aria-haspopup="true"
                                // onClick={(e) => handleClick(e, row.id)}
                              >
                                {/* <Menu
          anchorEl={anchorEl}
          id={`menu-${row.id}`}
          // open={Boolean(anchorEl && selectedId === row.id)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDelete(row.id)}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu> */}
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
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
    </DashboardContent>
  );
}
