import { useState } from "react";
import "./Login.css"
import Header from "../component/Header/Header";

function Login(){

    const [icon, setIcon] = useState("/images/icon/Hamburger.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Login;