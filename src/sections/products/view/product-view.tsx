import { useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, IconButton, Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AddBulkProduct } from '../add-bulk-product';

export function ProductView() {
  const [addProduct, setAddProduct] = useState(false);
  const [addBulkProduct, setAddBulkProduct] = useState(false);

  return (
    <DashboardContent>
      {!addProduct && !addBulkProduct && (
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Product
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setAddBulkProduct(true)}
            sx={{ marginRight: 2 }} // Add margin to the right
          >
            Add Bulk Product
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setAddProduct(true)}
          >
            Add Product
          </Button>
        </Box>
      )}
      {addBulkProduct && !addProduct && (
        <>
          <Box display="flex" alignItems="center" mb={5} gap={2}>
            <IconButton>
              <ArrowBackIcon onClick={() => setAddBulkProduct(false)} />
            </IconButton>
            <Typography variant="h4" flexGrow={1} textAlign="center">
              Bulk Upload Product
            </Typography>
          </Box>
          <AddBulkProduct />
        </>
      )}
      {!addBulkProduct && addProduct && (
        <Box display="flex" alignItems="center" mb={5} gap={2}>
          <IconButton>
            <ArrowBackIcon onClick={() => setAddProduct(false)} />
          </IconButton>
          <Typography variant="h4" flexGrow={1} textAlign="center">
            Add Product
          </Typography>
        </Box>
      )}
    </DashboardContent>
  );
}
