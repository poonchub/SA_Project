import { useState } from "react"
import Header from "../components/Header/Header";

function Home(){

    const [icon, setIcon] = useState("/images/icon/Hamburger.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Home;