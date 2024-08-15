import { useState } from "react"
import Header from "../component/Header"
import "./Home.css"

function Home(){

    const [icon, setIcon] = useState("/images/icon/Hamburger.png");

    return (
        <>
            <Header icon={icon}/>
        </>
    )
}

export default Home;