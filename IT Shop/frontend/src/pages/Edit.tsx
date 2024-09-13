import Header from "../components/Header/Header";
import EditProfile from "../components/EditProfile/EditProfile.tsx";
<<<<<<< HEAD
import { AppContext } from "../App";
import { useContext } from "react";
=======
import { useContext } from "react";
import { AppContext } from "../App";
>>>>>>> main

function Edit(){
    
    const {logoutPopup} = useContext(AppContext)

    const {logoutPopup} = useContext(AppContext)
    return (
        <>
<<<<<<< HEAD
            {logoutPopup}
            <Header page={"edit"}/>
=======
            
            
            {logoutPopup}
            <Header page={"profile"}/>
>>>>>>> main
            <EditProfile/>
        </>
    )
}

export default Edit