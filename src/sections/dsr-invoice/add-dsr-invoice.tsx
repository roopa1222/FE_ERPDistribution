import type { AlertColor } from '@mui/material/Alert';
import type { SnackbarCloseReason } from '@mui/material/Snackbar';

import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
import { Form, Field, Formik, ErrorMessage } from 'formik';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  ListItemText,
  Autocomplete,
  OutlinedInput,
} from '@mui/material';

import { getApi, postApi } from 'src/service/api';

const paymentOptions = [
  'UPI',
  'Debit',
  'Credit',
  'Cash',
  'Pending',
  'BuyBack',
  '1Finance',
  '2Finance',
];

const category = ['MOBILE', 'ELECTRONICS', 'ACCESSORIES'];

interface Branch {
  _id: string;
  branchName: string;
}

interface FormValues {
  productName: string;
  productCode: string;
  firstFinanceName: string;
  secondFinanceName: string;
  paymentMode: string[];
  customerName: string;
  customerMobileNo: string;
  totalAmount: string;
  category: string;
  [key: string]: string | string[]; // Allow dynamic keys like UPIAmount, CashAmount, etc.
}

const RequiredLabel = ({ label }: { label: string }) => (
  <Typography component="span" sx={{ display: 'inline', fontSize: '1rem' }}>
    {label}
    <Typography component="span" sx={{ color: 'red', marginLeft: '2px' }}>
      *
    </Typography>
  </Typography>
);

const DsrAddInvoiceView = () => {
  const [paymentModes, setPaymentModes] = useState<string[]>([]); // Maintain payment modes state
  const [totalCalculatedAmount, setTotalCalculatedAmount] = useState(0);
  const [roleWiseAccess, setRoleWiseAccess] = useState(false);
  const [branchData, setBranchData] = useState<Branch[]>([]);
  const [open, setOpen] = useState(false);
  const [severityLevel, setSeverityLevel] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'SALESMAN') {
      setRoleWiseAccess(true);
    } else {
      getBrachData();
    }
  }, []);

  const getBrachData = async () => {
    const response = await getApi('/v1/branch/all-branches');
    if (response) {
      setBranchData(response.data.data);
    }
  };

  // Validation schema setup
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Product Name is required'),
    productCode: Yup.string(),
    firstFinanceName: paymentModes.includes('1Finance')
      ? Yup.string().required('Finance Name 1 is Required')
      : Yup.string(),
    secondFinanceName: paymentModes.includes('2Finance')
      ? Yup.string().required('Finance Name 2 is Required')
      : Yup.string(),
    paymentMode: Yup.array().min(1, 'Please select at least one payment mode'),
    branchId: roleWiseAccess ? Yup.string() : Yup.string().required('Branch is Required'),
    customerName: Yup.string(),
    customerMobileNo: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
    totalAmount: Yup.number(),
    category: Yup.string().required('Category is Required'),
    // Dynamically add validation for each payment mode
    ...paymentOptions.reduce(
      (schema, mode) => {
        schema[`${mode.toLowerCase()}Amount`] = Yup.number().test(
          'is-required',
          `${mode} Amount is required`,
          (value) => {
            // Use the paymentModes state directly for context
            if (paymentModes.includes(mode)) {
              // If the payment mode is selected, validate the amount
              if (!value || value <= 0) {
                // Return the error directly instead of using `this.createError()`
                return new Yup.ValidationError(
                  `${mode} Amount must be greater than zero`,
                  undefined,
                  `${mode.toLowerCase()}Amount`
                );
              }
              return true; // Return true if validation is successful
            }
            return true; // If the payment mode is not selected, skip validation
          }
        );
        return schema;
      },
      {} as Record<string, Yup.NumberSchema>
    ),
  });

  const amountFields = [
    'cashAmount',
    'creditAmount',
    'debitAmount',
    'pendingAmount',
    'upiAmount',
    'buybackAmount',
    '1financeAmount',
    '2financeAmount',
  ];

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Formik<FormValues>
        initialValues={{
          productName: '',
          productCode: '',
          firstFinanceName: '',
          secondFinanceName: '',
          paymentMode: [],
          customerName: '',
          customerMobileNo: '',
          branchId: '',
          category: '',
          totalAmount: '',
          ...paymentOptions.reduce(
            (initialValues, mode) => {
              initialValues[`${mode.toLowerCase()}Amount`] = ''; // Dynamic amounts initialization
              return initialValues;
            },
            {} as Record<string, string>
          ),
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const formData = {
            productName: values.productName,
            serialNo: values.productCode,
            paymentMode: values.paymentMode,
            customerName: values.customerName,
            customerMobileNo: values.customerMobileNo,
            totalAmount: totalCalculatedAmount,
            category: values.category,
            branchId: values.branchId,
            financeDetails: [
              ...(values.firstFinanceName
                ? [
                    {
                      financeName: values.firstFinanceName,
                      amount: values['1financeAmount'] || '0',
                    },
                  ]
                : []),
              ...(values.secondFinanceName
                ? [
                    {
                      financeName: values.secondFinanceName,
                      amount: values['2financeAmount'] || '0',
                    },
                  ]
                : []),
            ],
            paymentDetails: paymentOptions.reduce(
              (details, mode) => {
                const amount = values[`${mode.toLowerCase()}Amount`] as string; // Type assertion to 'string'
                if (amount && parseFloat(amount) > 0) {
                  details.push({ mode, amount });
                }
                return details;
              },
              [] as { mode: string; amount: string }[]
            ), // Store payment mode and amount pairs
          };

          const response = await postApi('/v1/dsrInvoice/add-dsr-invoice', formData);
          if (response.status === 200) {
            setSeverityLevel('success');
            setMessage(response.data.message);
            handleClick();
            resetForm();
            setTotalCalculatedAmount(0); // Reset total calculated amount
            setPaymentModes([]); // Reset selected payment modes
          } else {
            setSeverityLevel('error');
            setMessage(response.data.message);
            handleClick();
          }
        }}
        validateOnChange={false} // Disable auto-validation on each change to prevent excessive revalidation
        validateOnBlur={false}
      >
        {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => {
          // Update paymentModes based on selected payment modes
          const handlePaymentModeChange = (e: any) => {
            const selectedModes = e.target.value;

            const deselectedModes = paymentModes.filter((mode) => !selectedModes.includes(mode));

            deselectedModes.forEach((mode) => {
              setFieldValue(`${mode.toLowerCase()}Amount`, '0');
              if (mode === '1Finance') {
                setFieldValue('firstFinanceName', '');
              } else if (mode === '2Finance') {
                setFieldValue('secondFinanceName', '');
              }
            });
            setPaymentModes(selectedModes);
            setFieldValue('paymentMode', selectedModes);
          };

          const amounts = amountFields.reduce((sum, field) => {
            const amount = parseFloat(values[field] as string) || 0;
            return sum + amount;
          }, 0);

          if (amounts > 0) {
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
                      label={<RequiredLabel label="Product Name" />}
                      error={Boolean(touched.productName && errors.productName)}
                      helperText={
                        touched.productName && errors.productName ? errors.productName : ''
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="productCode"
                      label="Serial Number"
                      error={Boolean(touched.productCode && errors.productCode)}
                      helperText={
                        touched.productCode && errors.productCode ? errors.productCode : ''
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="customerName"
                      label="Customer Name"
                      error={Boolean(touched.customerName && errors.customerName)}
                      helperText={
                        touched.customerName && errors.customerName ? errors.customerName : ''
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="customerMobileNo"
                      label="Customer Mobile No"
                      error={Boolean(touched.customerMobileNo && errors.customerMobileNo)}
                      helperText={
                        touched.customerMobileNo && errors.customerMobileNo
                          ? errors.customerMobileNo
                          : ''
                      }
                    />
                  </Grid>
                  {!roleWiseAccess && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          options={branchData}
                          getOptionLabel={(option) => option.branchName || ''}
                          isOptionEqualToValue={(option, value) =>
                            value && typeof value === 'object' && option._id === value._id
                          }
                          value={
                            branchData.find((branch) => branch._id === values.branchId) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('branchId', value ? value._id : '');
                          }}
                          filterOptions={(options, state) =>
                            options.filter((option) =>
                              option.branchName
                                .toLowerCase()
                                .includes(state.inputValue.toLowerCase())
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={<RequiredLabel label="Select Branch" />}
                              error={touched.branchId && Boolean(errors.branchId)}
                              helperText={touched.branchId && errors.branchId}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <Autocomplete
                        options={category}
                        // getOptionLabel={(option) => option.branchName || ''}
                        // isOptionEqualToValue={(option, value) =>
                        //   value && typeof value === 'object' && option._id === value._id
                        // }
                        value={values.category}
                        onChange={(event, newValue) => {
                          setFieldValue('category', newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={<RequiredLabel label="Select Category" />}
                            variant="outlined"
                            error={Boolean(touched.category && errors.category)}
                            helperText={touched.category && errors.category ? errors.category : ''}
                            fullWidth
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <RequiredLabel label="Select Payment Mode" />
                      </InputLabel>
                      <Select
                        multiple
                        value={values.paymentMode}
                        onChange={handlePaymentModeChange}
                        input={
                          <OutlinedInput label={<RequiredLabel label="Select Payment Mode" />} />
                        }
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

                  {values.paymentMode.includes('1Finance') && (
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="firstFinanceName"
                        label={<RequiredLabel label="First Finance Name" />}
                        error={Boolean(touched.firstFinanceName && errors.firstFinanceName)}
                        helperText={
                          touched.firstFinanceName && errors.firstFinanceName
                            ? errors.firstFinanceName
                            : ''
                        }
                      />
                    </Grid>
                  )}
                  {values.paymentMode.includes('2Finance') && (
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        name="secondFinanceName"
                        label={<RequiredLabel label="Second Finance Name" />}
                        error={Boolean(touched.secondFinanceName && errors.secondFinanceName)}
                        helperText={
                          touched.secondFinanceName && errors.secondFinanceName
                            ? errors.secondFinanceName
                            : ''
                        }
                      />
                    </Grid>
                  )}

                  {/* Dynamically render fields based on selected payment modes */}
                  {values.paymentMode.map((mode) => (
                    <Grid item xs={12} sm={6} key={mode}>
                      <Field
                        as={TextField}
                        fullWidth
                        name={`${mode.toLowerCase()}Amount`}
                        label={<RequiredLabel label={`${mode} Amount`} />}
                        error={Boolean(
                          touched[`${mode.toLowerCase()}Amount`] &&
                            errors[`${mode.toLowerCase()}Amount`]
                        )}
                        helperText={
                          touched[`${mode.toLowerCase()}Amount`] &&
                          errors[`${mode.toLowerCase()}Amount`]
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
                      helperText={
                        touched.totalAmount && errors.totalAmount ? errors.totalAmount : ''
                      }
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
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severityLevel}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DsrAddInvoiceView;
