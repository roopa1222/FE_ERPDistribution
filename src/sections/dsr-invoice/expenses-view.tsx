import React, { useEffect, useState } from "react";
import  {getApi}  from "src/service/api";
import {
  Button,
  Typography,
  Modal,
  Box,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpenseForm from "./expenses-form";


type Expense = {
  id: number;
  expenseName: string;
  expenseAmount: number;
  createdAt: string; // Format: YYYY-MM-DD
};

type ExpensesViewProps = {
  expensesDataView: boolean;
  handleBack: () => void;
};

const ExpensesView: React.FC<ExpensesViewProps> = ({ expensesDataView, handleBack }) => {
  const [expenses, setExpenses] = useState<any[]>([ ]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setFilteredExpenses(expenses); 
  }, [expenses]);

  useEffect(() => {
    getAllExpenses();
  }, []);

  // Open and close modal handlers
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Filter expenses by date range
  const handleSearch = () => {
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;
      return (
        (!start || expenseDate >= start) &&
        (!end || expenseDate <= end)
      );
    });
    setFilteredExpenses(filtered);
  };


  // Reset filters
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilteredExpenses(expenses);
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getAllExpenses = async () => {
    try {
      const response = await getApi('/v1/dailyexpense/daily-expense');
      setExpenses(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error); // Handle any error
    }
  };


  console.log('Expenses:', expenses);
console.log('Filtered Expenses:', filteredExpenses);


  return (
    <div>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={5} gap={2}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" flexGrow={1} textAlign="center">
          Expenses
        </Typography>
        <Button variant="contained" color="inherit" onClick={handleOpenModal}>
          Add Expenses
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" color="inherit" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Expense Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((expense, index) => (
                <TableRow key={expense.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{expense.expenseName}</TableCell>
                  <TableCell>${expense.expenseAmount}</TableCell>
                  <TableCell>{expense.createdAt}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredExpenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
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
          <ExpenseForm onClose={handleCloseModal} />
        </Box>
      </Modal>
    </div>
  );
};

export default ExpensesView;
