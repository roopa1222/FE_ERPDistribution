import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, Typography } from "@mui/material";

type BalanceFormProps = {
  onClose: () => void;
};

const BalanceForm: React.FC<BalanceFormProps> = ({ onClose }) => {
  // Validation Schema
  const validationSchema = Yup.object({
    openingBalance: Yup.number()
      .required("Opening Balance is required")
      .min(0, "Opening Balance must be greater than or equal to 0"),
    closingBalance: Yup.number()
      .min(
        Yup.ref("openingBalance"),
        "Closing Balance must be greater than or equal to Opening Balance"
      ),
  });

  // Form Submission
  const handleSubmit = (values: { openingBalance: number; closingBalance: number }) => {
    console.log("Balance Data:", values);
    onClose(); // Close the modal after saving
  };

  return (
    <Formik
      initialValues={{ openingBalance: 0, closingBalance: 0 }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Typography variant="h4" mb={3}>
            Manage Balances
          </Typography>
          <Box mb={2}>
            <Field
              name="openingBalance"
              as={TextField}
              fullWidth
              label="Opening Balance"
              type="number"
              error={touched.openingBalance && !!errors.openingBalance}
              helperText={touched.openingBalance && errors.openingBalance}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="closingBalance"
              as={TextField}
              fullWidth
              label="Closing Balance"
              type="number"
              error={touched.closingBalance && !!errors.closingBalance}
              helperText={touched.closingBalance && errors.closingBalance}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="inherit">
              Save
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default BalanceForm;
