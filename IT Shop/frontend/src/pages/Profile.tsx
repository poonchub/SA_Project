import { useContext } from "react";
import Header from "../components/Header/Header";
import { AppContext } from "../App";

function Profile(){
    const {logoutPopup} = useContext(AppContext)

    return (
        <>  
            {logoutPopup}
            <Header page={"profile"}/>
        </>
    )
}

export default Profile;