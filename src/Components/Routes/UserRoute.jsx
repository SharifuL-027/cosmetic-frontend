import { Navigate, Outlet } from 'react-router-dom';

export default function UserRoute() {
  // লোকাল স্টোরেজ থেকে ইউজারের ডাটা চেক করা
  const userInfo = localStorage.getItem('wbb_user');
  const user = userInfo ? JSON.parse(userInfo) : null;

  // ইউজার লগইন করা থাকলে তাকে পেজ দেখতে দেবে (সে নরমাল ইউজার বা অ্যাডমিন যাই হোক না কেন)
  if (user) {
    return <Outlet />;
  }

  // লগইন না থাকলে সরাসরি লগইন পেজে পাঠিয়ে দেবে
  return <Navigate to="/login" replace />;
}