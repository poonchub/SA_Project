import { useContext } from "react";
import Header from "../components/Header/Header";
import { AppContext } from "../App";

function Home(){

    const {logoutPopup} = useContext(AppContext)

    return (
        <>  
            {logoutPopup}
            <Header page={"home"}/>
        </>
    )
}

export default Home;