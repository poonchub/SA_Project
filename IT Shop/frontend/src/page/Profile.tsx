import { useState } from "react";
import "./Profile.css"
import Header from "../component/Header";

function Profile(){

    const [icon, setIcon] = useState("/images/icon/Hamburger.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Profile;