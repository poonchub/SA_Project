import Header from "../components/Header/Header";
import EditProfile from "../components/EditProfile/EditProfile.tsx";
import { useContext } from "react";
import { AppContext } from "../App";

function Edit(){
    
    const {logoutPopup} = useContext(AppContext)
    
    return (
        <>
            {logoutPopup}
            <Header page={"profile"}/>
            <EditProfile/>
        </>
    )
}

export default Edit
