import { useRoutes, RouteObject } from "react-router-dom";

import MainRoutes from "./MainRoutes";
import CustomerRoutes from "./CustomerRoutes";
import OwnerRoutes from "./OwnerRoutes";


function ConfigRoutes() {

    const isLoggedIn = localStorage.getItem("isLogin") === "true";

    let routes: RouteObject[] = [];

    if (isLoggedIn) {
        routes = [CustomerRoutes()];
    } 
    else {
        routes = [OwnerRoutes()];
    }

    return useRoutes(routes);
}

export default ConfigRoutes;