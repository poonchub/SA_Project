import Header from "../components/Header/Header";
import ShowProfile from "../components/ShowProfile/ShowProfile";
import { AppContext } from "../App";
import { useContext } from "react";

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

export default Profile