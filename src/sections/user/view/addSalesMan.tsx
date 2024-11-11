// Import the styles
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-phone-input-2/lib/style.css';

// eslint-disable-next-line import/no-extraneous-dependencies
import PhoneInput from 'react-phone-input-2';
import React, { useState, useContext } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import CloseIcon from '@mui/icons-material/Close';
import { Grid , Card, Button, TextField, Typography, IconButton, CardContent, FormControl, FormHelperText } from '@mui/material';

import { registerApi } from 'src/service/registerApi';

import { ToastContext } from 'src/components/toaster/toastProvider';





interface AddSalesManProps {
    handleClose: () => void;  // Function passed from the parent
}
export function AddSalesMan({ handleClose }: AddSalesManProps) {
    const { showToast } = useContext(ToastContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        branchId: '',
        mobileNo: '',
        // address: '',
        userName: '',
        role: '',
        email: '',
        password:'',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        branchId: '',
        mobileNo: '',
        // address: '',
        userName: '',
        email: '',
        role: '',
        password:'',
    });

    // Email Validation Function
    const validateEmail = (email: string) => {
        // Regex to match allowed format: no special chars before '@', and only 'gmail.com' or '.in' domains
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|in)$/;
        return regex.test(email);
    };

    // Mobile Number Validation (only digits and 10 digits length)
    const validateMobileNumber = (mobileNo: string) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(mobileNo);
    };

    // Handle Input Change with validation for firstName and lastName
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Update form data
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Real-time validation
        let error = '';

        // Validation for firstName and lastName to prevent numbers
        if ((name === 'firstName' || name === 'lastName' || name === 'userName' || name === 'role') && /\d/.test(value)) {
            error = 'Numbers are not allowed in this field';
        }

        // Email validation
        else if (name === 'email') {
            error = validateEmail(value) ? '' : 'Invalid email format (e.g., user@gmail.com or user@domain.in)';
        }

        // Date of Birth validation for age restriction and future date
        else if (name === 'dob') {
            const today = new Date();
            const dob = new Date(value);
            const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

            if (dob > today) {
                error = 'Date of Birth cannot be in the future';
            } else if (dob > minDate) {
                error = 'You must be at least 18 years old';
            }
        }

        // Update errors
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };


    // Handle Select Change
    // const handleSelectChange = (e: SelectChangeEvent<string>) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

    // Handle Input Blur (trigger validation when user clicks out of the field)
    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let error = '';

        // Validate firstName and lastName to ensure they contain only letters (no numbers)
        if ((name === 'firstName' || name === 'lastName' || name === 'userName' || name === 'role') && /\d/.test(value)) {
            error = `${name.replace(/([A-Z])/g, ' $1')} should not contain numbers`;
        } else if (name === 'firstName' || name === 'lastName' || name === 'branchId' || name === 'userName' || name === 'role' || name === 'password') {
            if (!value) error = `${name.replace(/([A-Z])/g, ' $1')} is required`;
        } else if (name === 'mobileNo') {
            if (!validateMobileNumber(value)) error = 'Enter a valid 10-digit mobile number';
        } 
        // else if (name === 'dob') {
        //     const today = new Date();
        //     const dob = new Date(value);
        //     const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        //     if (!value) {
        //         error = 'Date of Birth is required';
        //     } else if (dob > minDate) {
        //         error = 'You must be at least 18 years old';
        //     }
        // } 
        else if (name === 'email') {
            if (!validateEmail(value)) error = 'Please enter a valid email address';
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // Handle Phone Number Input
    const handlePhoneChange = (phone: string) => {
        const numericPhone = phone.replace(/\D/g, ''); // Only numeric value
        setFormData((prev) => ({
            ...prev,
            mobileNo: numericPhone,
        }));
    };

    // Handle Form Submission
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            let formValid = true;
            const newErrors = {
                firstName: '',
                lastName: '',
                branchId: '',
                mobileNo: '',
                // address: '',
                userName: '',
                email: '',
                role: '',
                password:'',
            };

            // Validate all fields
            Object.keys(formData).forEach((field) => {
                const value = formData[field as keyof typeof formData];
                if (!value) {
                    newErrors[field as keyof typeof newErrors] = `${field} is required`;
                    formValid = false;
                }
            });

            // Check if form is valid
            if (!formValid) {
                setErrors(newErrors);
                return;
            }

            // Reset errors if form is valid
            setErrors({
                firstName: '',
                lastName: '',
                branchId: '',
                mobileNo: '',
                // address: '',
                userName: '',
                email: '',
                role: '',
                password:'',
            });
            try {
                const response = await registerApi('/v1/auth/add-user', formData); // Call registerApi with formData
                if (response.status === 200) {
                    showToast(response.data.message, 'success');
                    handleClose();
                } else {
                    showToast(response.data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                showToast(error.message, 'error');
            }
        };

    return (
        <Card sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
        <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Add New User
                </Typography>
                <IconButton onClick={handleClose} color="primary">
                    <CloseIcon />
                </IconButton>
            </div>
    
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="User Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={!!errors.userName}
                            helperText={errors.userName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Email ID"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                    label="Branch Id"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={!!errors.branchId}
                    helperText={errors.branchId}
                />
                    </Grid >
                    <Grid item xs={6}>
                    <FormControl fullWidth margin="normal" error={!!errors.mobileNo}>
                    <PhoneInput
                        country="in"
                        value={formData.mobileNo}
                        onChange={handlePhoneChange}
                        inputStyle={{ width: '100%' }}
                        disableDropdown
                        onlyCountries={['in']}
                        specialLabel="Enter phone number"
                    />
                    {errors.mobileNo && <FormHelperText>{errors.mobileNo}</FormHelperText>}
                </FormControl>
                    </Grid>
                    {/* <Grid item xs={6}>
                    <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={!!errors.address}
                    helperText={errors.address}
                />
                    </Grid> */}
                    <Grid item xs={6}>
                    <TextField
                            label="Role"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={!!errors.role}
                            helperText={errors.role}
                        />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                    Add User
                </Button>
            </form>
        </CardContent>
    </Card>
    
    );
}
