import { useContext } from "react";
import Header from "../components/Header/Header";
import { AppContext } from "../App";
import ShowProfile from "../components/ShowProfile/ShowProfile";
import { AppContext } from "../App";
import { useContext } from "react";

function Profile(){
    const {logoutPopup} = useContext(AppContext)

    const {logoutPopup} = useContext(AppContext)
    return (
<<<<<<< HEAD
        <>
=======
        <>  
>>>>>>> main
            {logoutPopup}
            <Header page={"profile"}/>
            <ShowProfile/>
        </>
    )
}

export default Profile;