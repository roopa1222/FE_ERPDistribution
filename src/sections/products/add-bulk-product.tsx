import type { AlertColor, SnackbarCloseReason } from '@mui/material';

import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, Alert, Button, Snackbar, AlertTitle, IconButton, Typography } from '@mui/material';

import { postApi } from 'src/service/api';

export function AddBulkProduct() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // State for upload progress
  const [open, setOpen] = useState(false);
  const [severityLevel, setSeverityLevel] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string>('');

  const WarningMessage = `Kindly ensure you're using the most updated content by consistently downloading the latest
        template. This can be achieved by clicking on the 'Download Excel Template' button.`;

  // Handle file change (validation)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      // Check if the file is an Excel file (xls or xlsx)
      const isExcelFile = file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
      if (!isExcelFile) {
        alert('Please upload an Excel file (XLS or XLSX only).');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  // Reset the selected file
  const resetFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true); // Set loading state

    try {
      //   const response = await axios.post('/api/upload', formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      const response = await postApi('', formData);
      setSeverityLevel('success');
      setMessage('File uploaded successfully');
      handleClick();
    } catch (error) {
      setSeverityLevel('error');
      setMessage('Error uploading file');
      handleClick();
    } finally {
      setIsUploading(false);
      resetFile();
    }
  };

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
      <Divider />
      <Typography gutterBottom sx={{ fontSize: '1.1rem', color: 'gray' }}>
        Please upload the product excel sheet (xlsx or xls files only)
      </Typography>
      <Alert severity="warning" variant="outlined" sx={{ bgcolor: 'background.paper' }}>
        <AlertTitle>Template filling instructions</AlertTitle>
        {WarningMessage}
      </Alert>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="outlined" color="inherit">
          Download Excel Template
        </Button>
      </Box>
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          width: '100%',
          margin: 'auto',
          ':hover': { borderColor: '#000', backgroundColor: '#f5f5f5' },
        }}
      >
        <IconButton
          sx={{
            backgroundColor: '#f0f0f0',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            marginBottom: '10px',
            cursor: 'pointer',
            ':hover': { backgroundColor: '#e0e0e0' },
          }}
          disableRipple
        >
          {selectedFile ? (
            <DescriptionIcon sx={{ fontSize: '30px', color: '#000' }} />
          ) : (
            <FileUploadOutlinedIcon
              sx={{ fontSize: '30px', color: '#000' }}
              onClick={() => document.getElementById('file-upload')?.click()}
            />
          )}
        </IconButton>
        <input
          type="file"
          accept=".xls, .xlsx"
          onChange={handleFileChange} // Handle file selection
          style={{ display: 'none' }}
          id="file-upload"
        />
        {!selectedFile && (
          <>
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, cursor: 'pointer' }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Upload a file
            </Typography>
            <Typography variant="body2" sx={{ color: '#888888' }}>
              XLS, XLSX up to 10MB
            </Typography>
          </>
        )}
        {selectedFile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            <Typography variant="body2" sx={{ color: '#000', marginRight: '10px' }}>
              {selectedFile?.name}
            </Typography>
            <IconButton onClick={resetFile} sx={{ color: '#f44336' }}>
              <CancelIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <LoadingButton
          variant="contained"
          loading={isUploading}
          onClick={handleUpload}
          disabled={!selectedFile}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          color="inherit"
        >
          Upload & Save
        </LoadingButton>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
}
