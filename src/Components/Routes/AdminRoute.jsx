import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {

  const userInfo = localStorage.getItem('wbb_user');
  const user = userInfo ? JSON.parse(userInfo) : null;

  if (user && user.role === 'admin') {
    return <Outlet />; // অ্যাডমিন হলে তাকে পেজ দেখতে দেবে
  }


  return <Navigate to="/login" replace />;
}