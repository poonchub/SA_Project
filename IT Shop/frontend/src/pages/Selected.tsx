import { useState } from "react";
import Header from "../components/Header/Header";
import ShowDetail from "../components/ShowDetail/ShowDetail";
import ShowImage from "../components/ShowImage/ShowImage";

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