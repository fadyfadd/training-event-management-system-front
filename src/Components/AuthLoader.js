import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Store/authSlice';

function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      dispatch(loginSuccess({ token, role }));
    }
  }, [dispatch]);

  return null; 
}
export default AuthLoader;