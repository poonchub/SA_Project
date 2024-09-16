import { RouteObject } from "react-router-dom";
import Home from "../pages/home/Home";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";
import Login from "../pages/authentication/login/Login";


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
                path: "/Login",

                element: <Login />,
            },
            {
                path: "*",

                element: <Login />,
            },
        ],
    };
};

export default MainRoutes;
