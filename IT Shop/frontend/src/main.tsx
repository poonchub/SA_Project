import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home.tsx'
import Product from './pages/Product.tsx'
import Selected from './pages/Selected.tsx'
import Profile from './pages/Profile.tsx'
import Payment from './pages/Payment.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/Product",
    element: <Product/>
  },
  {
    path: "/Selected",
    element: <Selected/>
  },
  {
    path: "/Profile",
    element: <Profile/>
  },
  {
    path: "/Cart",
    element: <Profile/>
  },
  {
    path: "/Login",
    element: <Profile/>
  },
  {
    path: "/Payment",
    element: <Payment/>
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
