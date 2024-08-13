import { useState } from "react";
import Header from "../component/Header";
import ShowDetail from "../component/ShowDetail";
import ShowImage from "../component/ShowImage";
import "./Selected.css"

function Selected(){

    const [icon, setIcon] = useState("/images/icon/back.png");
    

    return (
        <>
            <Header icon={icon}/>
            <ShowImage/>
            <ShowDetail/>
        </>
    )
}

export default Selected;