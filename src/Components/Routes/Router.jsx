import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Routes/Layout';
import AdminLayout from '../Routes/AdminLayout'; 
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
    ],
  },
  
  {
    path: '/admin',
    element: <AdminRoute />, 
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          
        ],
      },
    ],
  },
]);