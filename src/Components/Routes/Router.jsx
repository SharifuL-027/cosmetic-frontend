import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Routes/Layout';
import AdminLayout from '../Admin/AdminLayout'; 
import AdminRoute from '../Routes/AdminRoute'; 

import Home from '../Home/Home';
import Shop from '../Pages/Shop';
import Login from '../Pages/Login';
import AdminDashboard from '../Admin/AdminDashboard';
import AdminProducts from '../Admin/AdminProducts';
import AddProduct from '../Admin/AddProduct';
import AdminCategory from '../Admin/AdminCategory';
import Profile from '../Pages/Profile';
import UserRoute from './UserRoute';

export const router = createBrowserRouter([
  
  {
    path: '/',
    element: <Layout />, 
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
    ],
  },
  { 
    path: '/login', 
    element: <Login /> 
  },
  {
        path: 'profile',
        element: <UserRoute />,
        children: [
          { path: '', element: <Profile/> },
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
          { path: 'products', element: <AdminProducts /> },
          { path: 'products/add', element: <AddProduct/> },
          { path: 'categories', element: <AdminCategory /> },
          
        ],
      },
    ],
  },
]);