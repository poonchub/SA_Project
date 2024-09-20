import { RouteObject } from "react-router-dom";
import Home from "../pages/Home/Home";
import Selected from "../pages/Selected";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";
import Login from "../pages/Authentication/Login/Login";
import ProductList from "../pages/ProductManagement/ProductList";
import ProductEdit from "../pages/ProductManagement/edit/ProductEdit";
import ProductCreate from "../pages/ProductManagement/create/ProductCreate";
import ShowOwnerProfile from "../pages/ProductManagement/OwnerPofile";
import AdminManagement from "../pages/ProductManagement/AdminManagement/AdminManagement";
import OwnerCreate from "../pages/ProductManagement/AdminManagement/create/OwnerCreate";
const OwnerRoutes = (): RouteObject => {
 
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
                path: "/ProductManagement",
                element: <ProductList />
            },
            {
                path: "/Selected",
                element: <Selected />
            },
            {
                path: "/OwnerProfile",
                element: <ShowOwnerProfile />
            },
            {
                path: "/Product/Edit/:id",
                element: <ProductEdit />
            },
            {
                path: "/Product/Create",
                element: <ProductCreate/>
            },

            {
                path:"/AdminManagement",
                element: <AdminManagement/>
            },

            {
                path:"/Owner/Create",
                element: <OwnerCreate/>
            }



        ],

    };

};


export default OwnerRoutes;
