import React, { useState } from "react";
import { Button, Typography, Modal, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back icon
import BalanceForm from "./balance-form"; // Import BalanceForm instead of BalanceView

type BalanceViewProps = {
  balanceDataView: boolean;
  handleBack: () => void; // Add handleBack to props
};

const BalanceView: React.FC<BalanceViewProps> = ({ balanceDataView, handleBack }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
          <BalanceForm onClose={handleCloseModal} /> {/* Render BalanceForm here */}
        </Box>
      </Modal>
    </div>
  );
};

export default BalanceView;
