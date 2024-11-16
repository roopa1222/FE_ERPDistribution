import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, Typography } from "@mui/material";

type ExpenseFormProps = {
  onClose: () => void;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose }) => {
  // Validation Schema
  const validationSchema = Yup.object({
    expenseName: Yup.string().required("Expense Name is required"),
    expenseAmount: Yup.number()
      .required("Expense Amount is required")
      .min(0, "Amount must be greater than or equal to 0"),
  });

  // Form Submission
  const handleSubmit = (values: { expenseName: string; expenseAmount: number }) => {
    console.log("Expense Data:", values);
    onClose(); // Close the modal after saving
  };

  return (
    <Formik
      initialValues={{ expenseName: "", expenseAmount: 0 }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
            <Typography variant='h4' flexGrow={1}>
         Create Expenses
        </Typography>
          <Box mb={2}>
            <Field
              name="expenseName"
              as={TextField}
              fullWidth
              label="Expense Name"
              error={touched.expenseName && !!errors.expenseName}
              helperText={touched.expenseName && errors.expenseName}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="expenseAmount"
              as={TextField}
              fullWidth
              label="Expense Amount"
              type="number"
              error={touched.expenseAmount && !!errors.expenseAmount}
              helperText={touched.expenseAmount && errors.expenseAmount}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onClose} color='inherit'>
              Cancel
            </Button>
            <Button type="submit" 
          variant='contained'
          color='inherit'>
              Save
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ExpenseForm;
