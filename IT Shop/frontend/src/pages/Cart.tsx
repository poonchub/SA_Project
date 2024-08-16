import { useState } from "react";
import Header from "../components/Header/Header";

function Cart(){
    
    const [icon, setIcon] = useState("/images/icon/Hamburger.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Cart;