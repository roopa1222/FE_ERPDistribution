import React, { useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, Typography } from "@mui/material";
import { ToastContext } from "src/components/toaster/toastProvider";
import { postApi } from "src/service/api";

type ExpenseFormProps = {
  onClose: () => void;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose }) => {
  const { showToast } = useContext(ToastContext);

  // Validation Schema
  const validationSchema = Yup.object({
    expenseName: Yup.string().required("Expense Name is required"),
    expenseAmount: Yup.number()
      .required("Expense Amount is required")
      .min(0, "Amount must be greater than or equal to 0"),
  });

  // Form Submission
  const handleSubmit = async (values: { expenseName: string; expenseAmount: number }) => {
    const response = await postApi('/v1/dailyexpense/add-expense', values);
    if (response.status === 200) {
        showToast(response.data.message, 'success');
        setTimeout(() => {
        }, 1000);
    } else {
        showToast(response.data.message || 'Add Expenses failed', 'error');
    }
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
