import { useState } from "react";
import Header from "../components/Header/Header";

function Payment(){

    const [icon, setIcon] = useState("/images/icon/back.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Payment;