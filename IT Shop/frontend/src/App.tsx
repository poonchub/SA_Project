import React, { createContext, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ConfigRoutes from "./routes";
import "./App.css";

export const AppContext = createContext({
    logoutPopup: null,
    setLogoutPopup: (param: any) => {},
})

const App: React.FC = () => {
    const [logoutPopup, setLogoutPopup] = useState(null)
    return (
        <Router>
            <AppContext.Provider value={{
                logoutPopup,
                setLogoutPopup
            }}> 
                <ConfigRoutes />
            </AppContext.Provider>
        </Router>
    );
};

export default App;
