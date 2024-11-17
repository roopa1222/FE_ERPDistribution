import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { postApi } from 'src/service/api';

const paymentOptions = ['UPI', 'Debit', 'Credit', 'Cash', 'Pending', 'Finance'];

interface FormValues {
  productName: string;
  productCode: string;
  financeName: string;
  paymentMode: string[];
  customerName: string;
  customerMobileNo: string;
  totalAmount: string;
  [key: string]: string | string[]; // Allow dynamic keys like UPIAmount, CashAmount, etc.
}

const DsrAddInvoiceView = () => {
  const [paymentModes, setPaymentModes] = useState<string[]>([]); // Maintain payment modes state
  const [totalCalculatedAmount, setTotalCalculatedAmount] = useState(0);

  // Validation schema setup
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Product Name is required'),
    productCode: Yup.string(),
    financeName: paymentModes.includes('Finance') ? Yup.string().required('Finance Name is Required') : Yup.string(),
    paymentMode: Yup.array().min(1, 'Please select at least one payment mode'),
    branchId: Yup.string().required('Branch is Required'),
    customerName: Yup.string(),
    customerMobileNo: Yup.string()
      .matches(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
    totalAmount: Yup.number(),
    // Dynamically add validation for each payment mode
    ...paymentOptions.reduce((schema, mode) => {
      schema[`${mode.toLowerCase()}Amount`] = Yup.number().test(
        'is-required',
        `${mode} Amount is required`,
        (value) => {
          // Use the paymentModes state directly for context
          if (paymentModes.includes(mode)) {
            // If the payment mode is selected, validate the amount
            if (!value || value <= 0) {
              // Return the error directly instead of using `this.createError()`
              return new Yup.ValidationError(`${mode} Amount must be greater than zero`, undefined, `${mode.toLowerCase()}Amount`);
            }
            return true; // Return true if validation is successful
          }
          return true; // If the payment mode is not selected, skip validation
        }
      );
      return schema;
    }, {} as Record<string, Yup.NumberSchema>),
  });

  const branches = [
    { _id: '1', branchName: "Branch A" },
    { _id: '2', branchName: "Branch B" },
    { _id: '3', branchName: "Branch C" },
  ];

  // Effect hook to update totalAmount whenever payment mode fields change
  useEffect(() => {
    console.log('paymentModes',paymentModes);
    
    const updateTotalAmount = (values: FormValues, setFieldValue: any) => {

      const totalAmount = paymentOptions.reduce((sum, option) => {
        const amountValue = values[`${option.toLowerCase()}Amount`] as string || '0';
        return sum + (parseFloat(amountValue) || 0);
      }, 0);
      setFieldValue('totalAmount', totalAmount.toString());
    };
  }, [paymentModes]); // Dependency array, re-run when paymentModes change

  useEffect(()=>{
console.log('totalCalculatedAmount',totalCalculatedAmount);
  },[totalCalculatedAmount])


  const amountFields = ['cashAmount', 'creditAmount', 'debitAmount', 'financeAmount', 'pendingAmount', 'upiAmount'];

  return (
    <Formik<FormValues>
      initialValues={{
        productName: '',
        productCode: '',
        financeName: '',
        paymentMode: [],
        customerName: '',
        customerMobileNo: '',
        branchId:'',
        totalAmount: '',
        ...paymentOptions.reduce((initialValues, mode) => {
          initialValues[`${mode.toLowerCase()}Amount`] = ''; // Dynamic amounts initialization
          return initialValues;
        }, {} as Record<string, string>),
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log('Form Submitted:', values);

        const formData = {
          productName: values.productName,
          productCode: values.productCode,
          paymentMode: values.paymentMode,
          customerName: values.customerName,
          customerMobileNo: values.customerMobileNo,
          totalAmount: totalCalculatedAmount,
          financeName: values.financeName,
          branchId: values.branchId,
          paymentDetails: paymentOptions.reduce((details, mode) => {
            const amount = values[`${mode.toLowerCase()}Amount`] as string; // Type assertion to 'string'
            if (amount) {
              details.push({ mode, amount });
            }
            return details;
          }, [] as { mode: string; amount: string }[]), // Store payment mode and amount pairs
        };

        console.log('Form Data on Submit:', formData);

      const response = await postApi('/v1/dsrInvoice/add-dsr-invoice', formData);

      console.log('response',response);
      

      }}
      validateOnChange={false} // Disable auto-validation on each change to prevent excessive revalidation
      validateOnBlur={false}
    >
      {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => {
        // Update paymentModes based on selected payment modes
        const handlePaymentModeChange = (e: any) => {
          const selectedModes = e.target.value;
          setPaymentModes(selectedModes);
          setFieldValue('paymentMode', selectedModes);
        };

        const amounts = amountFields.reduce((sum, field) => {
            const amount = parseFloat(values[field] as string) || 0;
            return sum + amount;
          }, 0);

        if(amounts > 0){
            setTotalCalculatedAmount(amounts);
        }
        return (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="productName"
                    label="Product Name"
                    error={Boolean(touched.productName && errors.productName)}
                    helperText={touched.productName && errors.productName ? errors.productName : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="productCode"
                    label="Product Code"
                    error={Boolean(touched.productCode && errors.productCode)}
                    helperText={touched.productCode && errors.productCode ? errors.productCode : ''}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="customerName"
                    label="Customer Name"
                    error={Boolean(touched.customerName && errors.customerName)}
                    helperText={touched.customerName && errors.customerName ? errors.customerName : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="customerMobileNo"
                    label="Customer Mobile No"
                    error={Boolean(touched.customerMobileNo && errors.customerMobileNo)}
                    helperText={touched.customerMobileNo && errors.customerMobileNo ? errors.customerMobileNo : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
  <InputLabel>Branch Name</InputLabel>
  <Select
    value={values.branchId} // Ensure branchId is a string
    onChange={(e) => handleChange(e)} // Update Formik value
    input={<OutlinedInput label="Branch Name" />}
    renderValue={(selected) => {
      // Ensure selected is handled as a string
      const branch = branches.find((branchData) => branchData._id === selected);
      return branch ? branch.branchName : ''; // Display branch name or empty string
    }}
  >
    {branches.map((branch) => (
      <MenuItem key={branch._id} value={branch._id}>
        {branch.branchName} {/* Display branch name */}
      </MenuItem>
    ))}
  </Select>
  <div style={{ color: 'red', fontSize: '0.8em' }}>
    <ErrorMessage name="branchId" component="div" />
  </div>
</FormControl>


</Grid>


                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Mode</InputLabel>
                    <Select
                      multiple
                      value={values.paymentMode}
                      onChange={handlePaymentModeChange}
                      input={<OutlinedInput label="Payment Mode" />}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {paymentOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          <Checkbox checked={values.paymentMode.includes(option)} />
                          <ListItemText primary={option} />
                        </MenuItem>
                      ))}
                    </Select>
                    <div style={{ color: 'red', fontSize: '0.8em' }}>
                      <ErrorMessage name="paymentMode" component="div" />
                    </div>
                  </FormControl>
                </Grid>

                {values.paymentMode.includes('Finance') &&
                                <Grid item xs={12} sm={6}>
                                <Field
                                  as={TextField}
                                  fullWidth
                                  name="financeName"
                                  label="Finance Name"
                                  error={Boolean(touched.financeName && errors.financeName)}
                                  helperText={touched.financeName && errors.financeName ? errors.financeName : ''}
                                />
                              </Grid> }

                {/* Dynamically render fields based on selected payment modes */}
                {values.paymentMode.map((mode) => (
                  <Grid item xs={12} sm={6} key={mode}>
                    <Field
                      as={TextField}
                      fullWidth
                      name={`${mode.toLowerCase()}Amount`}
                      label={`${mode} Amount`}
                      error={Boolean(touched[`${mode.toLowerCase()}Amount`] && errors[`${mode.toLowerCase()}Amount`])}
                      helperText={
                        touched[`${mode.toLowerCase()}Amount`] && errors[`${mode.toLowerCase()}Amount`]
                          ? errors[`${mode.toLowerCase()}Amount`]
                          : ''
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        setFieldValue(`${mode.toLowerCase()}Amount`, e.target.value);
                      }}
                    />
                  </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="totalAmount"
                    label="Total Amount"
                    value={totalCalculatedAmount}
                    disabled
                    error={Boolean(touched.totalAmount && errors.totalAmount)}
                    helperText={touched.totalAmount && errors.totalAmount ? errors.totalAmount : ''}
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default DsrAddInvoiceView;
