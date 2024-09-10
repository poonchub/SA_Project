import { RouteObject } from "react-router-dom";
import Home from "../pages/Home/Home";
import MinimalLayout from "../layout/MinimalLayOut/MinimalLayOut";


import Login from "../pages/Authentication/Login/Login";

// import Login from "../pages/Authentication/Login/Login";


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
