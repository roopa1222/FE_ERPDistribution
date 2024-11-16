import React, { useState } from "react";
import { Button, Typography, Modal,Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back icon
import ExpenseForm from "./expenses-form"; // Your custom import


type ExpensesViewProps = {
  expensesDataView: boolean;
  handleBack: () => void; // Add handleBack to props
};

const ExpensesView: React.FC<ExpensesViewProps> = ({ expensesDataView ,handleBack}:any) => {
  const [isEnabled, setIsEnabled] = useState(expensesDataView);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
//   const handleBack = () => 

  return (
    <div>
             <Box display="flex" alignItems="center" mb={5} gap={2}>
      {/* Back Icon */}
      <IconButton >
        <ArrowBackIcon  onClick={handleBack}/>
      </IconButton>

      {/* Centered Title */}
      <Typography variant="h4" flexGrow={1} textAlign="center">
        Expenses
      </Typography>

      {/* Add Expenses Button */}
      <Button variant="contained" color="inherit" onClick={handleOpenModal}>
        Add Expenses
      </Button>
    </Box>

    {/* Modal for the Expense Form */}
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
