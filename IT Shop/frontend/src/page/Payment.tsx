import { useState } from "react";
import Header from "../component/Header";
import "./Selected.css"

function Payment(){

    const [icon, setIcon] = useState("/images/icon/back.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Payment;