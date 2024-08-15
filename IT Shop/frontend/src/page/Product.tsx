import { useState } from "react";
import Header from "../component/Header"
import ShowProduct from "../component/ShowProduct"
import Sidebar from "../component/Sidebar"
import "./Product.css"

function Product(){

    const [icon, setIcon] = useState("/images/icon/Hamburger.png");

    return (
        <>
            <Header icon={icon}/>
            <Sidebar/>
            <ShowProduct/>
        </>
    )
}

export default Product;