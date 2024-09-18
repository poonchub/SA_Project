import { RouteObject } from "react-router-dom";
import Home from "../pages/Home/Home";
import Selected from "../pages/Selected";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";
import Login from "../pages/Authentication/Login/Login";
import ProductList from "../pages/ProductMangement/ProductList";
import ProductEdit from "../pages/ProductMangement/edit/ProductEdit";
import ProductCreate from "../pages/ProductMangement/create/ProductCreate";

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
            // {
            //     path: "/Profile",
            //     element: <Profile />
            // },
            {
                path: "/Product/Edit/:id",
                element: <ProductEdit />
            },
            {
                path: "/Product/Create",
                element: <ProductCreate/>
            },


        ],

    };

};


export default OwnerRoutes;
