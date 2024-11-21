import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { getApi, getBranchData } from 'src/service/branchApi';


import { AnalyticsCurrentVisits } from '../analytics-current-visits';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [from, setStartDate] = useState<string>("");
  const [to, setEndDate] = useState<string>("");
  const [branchId, setDropdownValue] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [dashboardData, setdashboardData] = useState<any>('');
  const [loading, setLoading] = useState(false);


  const getAllUser = async () => {
    try {
      const response = await getApi('/v1/branch/all-branches');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error); // Handle any error
    }
  };


  const handleInputChange = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (branchId) params.branchId = branchId;
      if (from) params.from = from;
      if (to) params.to = to;
      const response = await getBranchData(`/v1/dsrInvoice/dashboard-count`, { params });
      setdashboardData(response.data.dashBoardCount);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, [branchId, from, to]);  // This ensures the callback is memoized and only reruns when the dependencies change

  useEffect(() => {
    getAllUser();
    handleInputChange();
  }, [handleInputChange]);



  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '10vh', // Full viewport height
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          Welcome to the Tanishka Telecom
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" gap={2} alignItems="center" >
        {/* Branch Name - Left side */}
        <FormControl sx={{ minWidth: 300 }} >
          <InputLabel shrink htmlFor="branch-select" >Branch Name</InputLabel>
          <Select
            labelId="dropdown-label"
            variant="outlined"
            label="Branch Name"
            value={branchId}
            // onChange={handleSelectChange}
            displayEmpty
            onChange={(e) => setDropdownValue(e.target.value)}
          >
            <MenuItem value="" disabled>
              Search...
            </MenuItem>
            {data.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>
                {branch.branchName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Right side - Start Date, End Date, and Search Button */}
        <Box display="flex" gap={2}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ width: 300 }}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>
      </Box>


      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* First Row */}
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" color="primary">
                  {dashboardData.accessoriesCount}
                </Typography>
                <Typography variant="subtitle1">Total Accesseries count</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" color="primary">
                  {dashboardData.mobileCount}
                </Typography>
                <Typography variant="subtitle1">Total Mobile Count</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" color="primary">
                  {dashboardData.electronicCount}
                </Typography>
                <Typography variant="subtitle1">Total Electronic Count</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4} lg={4}>
            <AnalyticsCurrentVisits
              title="Current Data"
              chart={{
                series: [
                  { label: 'Accesseries count', value: dashboardData.accessoriesCount || 0 },
                  { label: 'Mobile Count', value: dashboardData.mobileCount || 0 },
                  { label: 'Electronic Count', value: dashboardData.electronicCount || 0 },
                ],
              }}
            />
          </Grid>
          {/* <Grid xs={12} md={4} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid> */}
        </Grid>
      </Box>

    </DashboardContent>
  );
}
