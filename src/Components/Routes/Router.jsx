import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Routes/Layout';
import AdminRoute from '../Routes/AdminRoute';

import Home from '../Home/Home';
import Shop from '../Pages/Shop';
import Login from '../Pages/Login'; 
import AdminDashboard from '../Pages/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'login', element: <Login /> }, 
      
      // Admin Private Routes (শুধুমাত্র অ্যাডমিনরা এক্সেস পাবে)
      {
        path: 'admin',
        element: <AdminRoute />, 
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
        
        ],
      },
    ],
  },
]);