import { useContext } from "react";
import Header from "../components/Header/Header";
import { AppContext } from "../App";
import ShowProfile from "../components/ShowProfile/ShowProfile";

function Profile(){
    const {logoutPopup} = useContext(AppContext)
    return (
        <>
            {logoutPopup}
            <Header page={"profile"}/>
            <ShowProfile/>
        </>
    )
}

export default Profile;