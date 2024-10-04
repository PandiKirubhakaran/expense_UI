import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box } from '@mui/material';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthProvider';
import { loginUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import PasswordField from '../components/PasswordField';


const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate=useNavigate()
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const userData = await loginUser(values);
      // console.log(userData,'userData')
      login(userData); 
      navigate('/')
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="email" as={TextField} label="Email" fullWidth margin="normal" />
            <PasswordField/>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth>
              Log In
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginPage;
