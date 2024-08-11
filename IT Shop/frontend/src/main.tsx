import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './page/Home.tsx'
import Product from './page/Product.tsx'
import Selected from './page/Selected.tsx'
import Profile from './page/Profile.tsx'

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
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
