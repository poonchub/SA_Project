import React, { createContext, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ConfigRoutes from "./routes";
import "./App.css";
import { message } from "antd";

export const AppContext = createContext<{
    logoutPopup: any,
    setLogoutPopup: (param: any) => void,
    messageApiLogout: any,
    contextHolderLogout: React.ReactElement | null,
}>({
    logoutPopup: null,
    setLogoutPopup: () => {},
    messageApiLogout: null,
    contextHolderLogout: null,
});

const App: React.FC = () => {
    const [logoutPopup, setLogoutPopup] = useState(null)
    const [messageApiLogout, contextHolderLogout] = message.useMessage();
    return (
        <Router>
            <AppContext.Provider value={{
                logoutPopup,
                setLogoutPopup,
                contextHolderLogout,
                messageApiLogout
            }}> 
                <ConfigRoutes />
            </AppContext.Provider>
        </Router>
    );
};

export default App;
