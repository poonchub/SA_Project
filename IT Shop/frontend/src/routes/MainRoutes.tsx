import { RouteObject } from "react-router-dom";
import Home from "../pages/Home/Home";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";
import LoginForCustomer from "../pages/Authentication/Login/LoginForCustomer";
import LoginForOwner from "../pages/Authentication/Login/LoginForOwner";


const MainRoutes = (): RouteObject => {
    return {
        path: "/",

        element: <MinimalLayout />,

        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/Login-Customer",
                element: <LoginForCustomer/>,
            },
            {
                path: "/Login-Owner",
                element: <LoginForOwner/>,
            },
            {
                path: "*",
                element: <LoginForCustomer />,
            },
        ],
    };
};

export default MainRoutes;
