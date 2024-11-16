import { Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';
import {Iconify} from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import Card from '@mui/material/Card';
import LoadingButton from '@mui/lab/LoadingButton';
import  DsrAddInvoiceView  from '../add-dsr-invoice';
import ExpensesView from '../expenses-view';
import BalanceView from './balance-view';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
    'UPI',
    'Debit',
    'Credit',
    'Cash',
    'Pending',
    '2Finance'
  ];

export function DsrInvoiceView() {
  const [addView, setAddView] = useState(false);
  const [expensesView, setExpesnesView] = useState(false);
  const [balanceView, setBalanceView] = useState(false);
  const [personName, setPersonName] = useState<string[]>([]);

  const handleAddInvoice = () => {
    setAddView(true);
  };

  const handleExpenses = () => {
    setExpesnesView(true);
  }

  const handleBalance = () => {
    setBalanceView(true);
  }
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const renderForm = (
<Box display="flex" flexDirection="column" alignItems="center"  mt={3}>
  <Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        name="product"
        label="Product Name"
      />
    </Grid>
    <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
        <InputLabel id="demo-multiple-checkbox-label">Payment Mode</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Payment Mode" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        name="customerName"
        label="Customer Name"
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        name="CustomerMobileNo"
        label="Customer Mobile No"
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
    );
  

  return (
    <DashboardContent>
      {!expensesView &&  !balanceView &&
      <Box display='flex' alignItems='center' mb={5} gap={2}>
        <Typography variant='h4' flexGrow={1}>
          DSR-INVOICE
        </Typography>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<Iconify icon='mingcute:eye-line' />}
          onClick={handleBalance}
        >
        Balances
        </Button>
        <Button
          variant='contained'
          color='inherit'
          startIcon={<Iconify icon='mingcute:eye-line' />}
          onClick={handleExpenses}
        >
        Expenses
        </Button>

        <Button
          variant='contained'
          color='inherit'
          startIcon={<Iconify icon='mingcute:add-line' />}
          onClick={handleAddInvoice}
        >
          Add Invoice
        </Button>
      </Box>}

      <Card>
        {addView && !expensesView && !balanceView &&
        <Box p={2}>
        <Typography variant='h6'>Create Invoice</Typography>
        {/* Add fields and components here for the invoice form */}

        <DsrAddInvoiceView/>

      </Box>
        } 

        {!addView && !expensesView && !balanceView &&
          <Box p={2}>
            <Typography variant='body1'>No invoice selected. Click Add Invoice to create a new one.</Typography>
          </Box>

        }
      </Card>
      
      {
            expensesView &&  !addView && !balanceView && 
            <ExpensesView expensesDataView={expensesView} handleBack={() => setExpesnesView(false)}/>
        }

{
            balanceView &&  !addView &&  !expensesView &&
            <BalanceView balanceDataView={balanceView} handleBack={() => setBalanceView(false)}/>
        }
    </DashboardContent>
  );
}
