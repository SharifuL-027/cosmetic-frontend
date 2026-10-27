import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Routes/Layout';
import Home from '../Home/Home';
import Shop from '../Pages/Shop';
// import Shop from '../pages/Shop';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // The Layout wraps around all child routes
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },

      // You can add more routes here later (e.g., product details, cart, login)
    ],
  },
]);