import { Button } from '@mui/material';
import { useAuth } from '../context/AuthProvider';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button variant="contained" color="secondary" onClick={logout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
