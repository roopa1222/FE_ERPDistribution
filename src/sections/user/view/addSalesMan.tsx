// Import the styles
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-phone-input-2/lib/style.css';

import type { SelectChangeEvent } from '@mui/material';

// eslint-disable-next-line import/no-extraneous-dependencies
import PhoneInput from 'react-phone-input-2';
import React, { useState, useEffect, useContext } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Card, Button, Select, MenuItem, TextField, Typography, IconButton, InputLabel, CardContent, FormControl, FormHelperText } from '@mui/material';

import { getApi } from 'src/service/branchApi';
import { registerApi } from 'src/service/registerApi';

import { ToastContext } from 'src/components/toaster/toastProvider';





interface AddSalesManProps {
    handleClose: () => void;
    getAllUser: () => Promise<void>;  // Function passed from the parent
}
export function AddSalesMan({ handleClose, getAllUser }: AddSalesManProps) {
    const { showToast } = useContext(ToastContext);
    const [data, setData] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        branchId: '',
        mobileNo: '',
        // address: '',
        userName: '',
        role: '',
        email: '',
        password: '',
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
        password: '',
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

    useEffect(() => {
        getAllBranch();
    }, []);

    const getAllBranch = async () => {
        try {
            const response = await getApi('/v1/branch/all-branches');
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error); // Handle any error
        }
    };

    // Handle Select Change
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target; 
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    };



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
            password: '',
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
            password: '',
        });
        try {
            const response = await registerApi('/v1/auth/add-user', formData); // Call registerApi with formData
            if (response.status === 200) {
                showToast(response.data.message, 'success');
                setTimeout(() => {
                    handleClose();
                    getAllUser();
                }, 2000);
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
                            <FormControl fullWidth margin="normal" error={!!errors.branchId}>
                                <InputLabel>Branch Name</InputLabel>
                                <Select
                                    variant="outlined"
                                    label="Branch Name"
                                    value={formData.branchId}
                                    name="branchId"
                                    onChange={handleSelectChange}
                                    onBlur={handleInputBlur}
                                >
                                    {data.map((branch) => (
                                        <MenuItem key={branch._id} value={branch._id}>
                                            {branch.branchName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.branchId}</FormHelperText>
                            </FormControl>
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
                            <FormControl
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={!!errors.role}
                            >
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="role-label"
                                    label="Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleSelectChange}
                                    onBlur={handleInputBlur}
                                >
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                    <MenuItem value="SALESMAN">Salesman</MenuItem>
                                    <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                                </Select>
                                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                            </FormControl>
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
