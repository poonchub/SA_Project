import { useRoutes, RouteObject } from "react-router-dom";

import MainRoutes from "./MainRoutes";
import CustomerRoutes from "./CustomerRoutes";


function ConfigRoutes() {

    const isLoggedIn = localStorage.getItem("isLogin") === "true";

    let routes: RouteObject[] = [];

    if (isLoggedIn) {
        routes = [CustomerRoutes()];
    } 
    else {
        routes = [MainRoutes()];
    }

    return useRoutes(routes);
}

export default ConfigRoutes;