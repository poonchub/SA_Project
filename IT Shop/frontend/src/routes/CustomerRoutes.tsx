import { RouteObject } from "react-router-dom";
import Home from "../pages/Home/Home";
import Product from "../pages/Product";
import Selected from "../pages/Selected";
import Profile from "../pages/Profile";
import Payment from "../pages/Payment";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";


import Login from "../pages/Authentication/Login/Login";
import Cart from "../pages/Cart";

// import Login from "../pages/Authentication/Login/Login";

const CustomerRoutes = (): RouteObject => {
 
    return {

        path: "/",

        element: <MinimalLayout/>,

        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/Login",

                element: <Login />,
            },
            {
                path: "/product",
                element: <Product />
            },
            {
                path: "/Selected",
                element: <Selected />
            },
            {
                path: "/Profile",
                element: <Profile />
            },
            {
                path: "/Cart",
                element: <Cart />
            },
            {
                path: "/Profile",
                element: <Profile />
            },
            {
                path: "/Payment",
                element: <Payment />
            },

        ],

    };

};


export default CustomerRoutes;