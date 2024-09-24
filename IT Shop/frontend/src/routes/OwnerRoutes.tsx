import { RouteObject } from "react-router-dom";
import Home from "../pages/Home/Home";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";
import ProductList from "../pages/ProductMangement/ProductList";
import ProductEdit from "../pages/ProductMangement/edit/ProductEdit";
import ProductCreate from "../pages/ProductMangement/create/ProductCreate";
import LoginForOwner from "../pages/Authentication/Login/LoginForOwner";
import Orderdetail from "../pages/ProductMangement/Orderdetail";
import OwnerEditProfile from "../pages/OwnerMangement/edit/OwnerEditProfile";
import OwnerCreate from "../pages/OwnerMangement/create/OwnerCreate";
import OwnerProfile from "../pages/OwnerMangement/OwnerPofile";

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
                path: "/Login-Owner",
                element: <LoginForOwner/>,
            },
            {
                path: "/ProductManagement",
                element: <ProductList />
            },
            {
                path: "/OwnerProfile",
                element: <OwnerProfile />
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
                path:"/Owner/Create",
                element: <OwnerCreate/>
            },
            {
                path: "/OwnerEditProfile/:id",
                element: <OwnerEditProfile />,
            },
            {
                path: "*",
                element: <Home />,
            },
            {
                path: "/order-detail/:orderId",
                element: <Orderdetail />,
            },
        ],

    };

};


export default OwnerRoutes;
