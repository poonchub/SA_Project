import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ConfigRoutes from "./routes";
import "./App.css";
import { message } from "antd";
//for countCart
import { GetCart } from "./services/http"; // ดึงฟังก์ชัน GetCart


export const AppContext = createContext<{
    logoutPopup: any,
    setLogoutPopup: (param: any) => void,
    messageApiLogout: any,
    contextHolderLogout: React.ReactElement | null,
    // for countCart
    countCart: number,
    setCountCart: (param: number) => void,
}>({
    logoutPopup: null,
    setLogoutPopup: () => {},
    messageApiLogout: null,
    contextHolderLogout: null,
    //for countCart
    countCart: 0,
    setCountCart: () => {},
    //end for cart
});

const App: React.FC = () => {
    const [logoutPopup, setLogoutPopup] = useState(null)
    const [messageApiLogout, contextHolderLogout] = message.useMessage();
    //for countCart
    const [countCart, setCountCart] = useState(0); // เพิ่ม state สำหรับจำนวนสินค้าในตะกร้า
    const fetchCartData = async () => {
        const cus_id = Number(localStorage.getItem("id"));
        const res = await GetCart(cus_id);
        if (res && Array.isArray(res.data)) {
            setCountCart(res.data.length); // อัพเดต countCart
        }
    };

    // เรียก fetchCartData เมื่อคอมโพเนนต์หลักโหลด
    useEffect(() => {
        fetchCartData();
    }, []);
    // end for cart

    return (
        <Router>
            <AppContext.Provider value={{
                logoutPopup,
                setLogoutPopup,
                contextHolderLogout,
                messageApiLogout,
                countCart,        // เพิ่มค่า countCart
                setCountCart,     // เพิ่มฟังก์ชัน setCountCart
            }}> 
                <ConfigRoutes />
            </AppContext.Provider>
        </Router>
    );
};

export default App;
