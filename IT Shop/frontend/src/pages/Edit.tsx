import Header from "../components/Header/Header";
import EditProfile from "../components/EditProfile/EditProfile.tsx";
import { AppContext } from "../App";
import { useContext } from "react";

function Edit(){
    
    const {logoutPopup} = useContext(AppContext)
    
    return (
        <>
            {logoutPopup}
            <Header page={"edit-profile"}/>
            <EditProfile/>
        </>
    )
}

export default Edit
