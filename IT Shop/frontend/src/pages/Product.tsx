import { useState } from "react";
import Header from "../components/Header/Header"
import Sidebar from "../components/Sidebar/Sidebar";
import ShowProduct from "../components/ShowProduct/ShowProduct";

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