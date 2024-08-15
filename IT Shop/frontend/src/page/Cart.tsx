import { useState } from "react";
import Header from "../component/Header"
import "./Cart.css"

function Cart(){
    
    const [icon, setIcon] = useState("/images/icon/Hamburger.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Cart;