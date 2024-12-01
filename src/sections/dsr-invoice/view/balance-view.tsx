import React, { useEffect, useState } from "react";
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
import { getApi } from "src/service/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BalanceForm from "./balance-form"; // Import BalanceForm


type Balance = {
  id: number;
  openingBalance: number;
  closingBalance: number;
  date: string; // Format: YYYY-MM-DD
};

type BalanceViewProps = {
  balanceDataView: boolean;
  handleBack: () => void;
};

const BalanceView: React.FC<BalanceViewProps> = ({ balanceDataView, handleBack }) => {
  const [balances, setBalances] = useState<any[]>([]);
  const [filteredBalances, setFilteredBalances] = useState<any[]>(balances);
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Open and close modal handlers
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    getAllBalance();
  }, []);

  // Filter balances by date range
  const handleSearch = () => {
    const filtered = balances.filter((balance) => {
      const balanceDate = new Date(balance.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;
      return (
        (!start || balanceDate >= start) &&
        (!end || balanceDate <= end)
      );
    });
    setFilteredBalances(filtered);
  };

  // Reset filters
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilteredBalances(balances);
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getAllBalance = async () => {
    try {
      const response = await getApi('/v1/dailyexpense/opening-closing-balance');
      console.log('responseBalance====>>>>>',response )
      setBalances(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error); // Handle any error
    }
  };

  useEffect(() => {
  setFilteredBalances(balances);
}, [balances]);

  console.log('filteredBalances====>>>>>',filteredBalances )

  return (
    <div>
      {/* Header with Back Button and Title */}
      <Box display="flex" alignItems="center" mb={5} gap={2}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" flexGrow={1} textAlign="center">
          Balances
        </Typography>

        <Button variant="contained" color="inherit" onClick={handleOpenModal}>
          Add Balance
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
              <TableCell>Opening Balance</TableCell>
              <TableCell>Closing Balance</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBalances
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((balance, index) => (
                <TableRow key={balance.id}>
                  <TableCell>{index + balance.id}</TableCell>
                  <TableCell>{balance.openingBalance}</TableCell>
                  <TableCell>{balance.closingBalance}</TableCell>
                  <TableCell>{balance.createdAt}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredBalances.length}
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
          <BalanceForm onClose={handleCloseModal} /> {/* Render BalanceForm */}
        </Box>
      </Modal>
    </div>
  );
};

export default BalanceView;
