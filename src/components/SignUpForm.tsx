import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField, Button, Box, Typography } from "@mui/material";
import * as Yup from "yup";
import { signupUser } from "../api/api";
import { useThemeContext } from "../theme/ThemeProvider";
import { useNavigate } from "react-router-dom";

// Define the form values interface
interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  mobile: string;
}

// Initial values for the form
const initialValues: SignupFormValues = {
  username: "",
  email: "",
  password: "",
  mobile: "",
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobile: Yup.string().required("Mobile number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeContext();
  // External handleSubmit function with explicit types
  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting, resetForm }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      const response = await signupUser(values);
      console.log("User signed up:", response);
      resetForm();
      navigate("/login");
    } catch (error) {
      console.error("There was an error signing up:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: isDarkMode ? "background.default" : "grey.100",
        padding: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: isDarkMode ? "background.paper" : "#fff",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                name="username"
                label="Username"
                as={TextField}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Field
                name="email"
                label="Email"
                type="email"
                as={TextField}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Field
                name="mobile"
                label="Mobile"
                as={TextField}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Field
                name="password"
                label="Password"
                type="password"
                as={TextField}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SignupForm;
