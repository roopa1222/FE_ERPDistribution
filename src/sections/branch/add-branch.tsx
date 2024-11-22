import React, { useContext } from "react";
import * as Yup from "yup";
import { Form, Field, Formik } from "formik";

import { Box, Button, TextField, Typography } from "@mui/material";
import { postApi } from "src/service/api";
import { ToastContext } from 'src/components/toaster/toastProvider';

type AddBranchProps = {
    onClose: () => void;
};
const AddBranch: React.FC<AddBranchProps> = ({ onClose }) => {

    const { showToast } = useContext(ToastContext);

    // Validation Schema
    const validationSchema = Yup.object({
        branchName: Yup.string().required("Expense Name is required"),
    });

    // Form Submission
    const handleSubmit = async (values: { branchName: string; }) => {
        const branchData = [{ branchName: values.branchName }];
        const response = await postApi('/v1/branch/add-branch', branchData);
        if (response.status === 200) {
            showToast(response.data.message, 'success');
            setTimeout(() => {
            }, 2000);
        } else {
            showToast(response.data.message || 'Add Branch failed', 'error');
        }
        onClose();
    };


    return (
        <Formik
            initialValues={{ branchName: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched }) => (
                <Form>
                    <Typography variant='h4' mb={2} flexGrow={1}>
                        Add Branch
                    </Typography>
                    <Box mb={2}>
                        <Field
                            name="branchName"
                            as={TextField}
                            fullWidth
                            label="Branch Name"
                            error={touched.branchName && !!errors.branchName}
                            helperText={touched.branchName && errors.branchName}
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

export default AddBranch;