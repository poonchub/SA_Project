import Header from "../components/Header/Header";
// import AddAddress from "../components/AddAddress/AddAddress.css"
// import EditProfile from "../components/EditProfile/EditProfile.tsx";
import { AppContext } from "../App";
import { useContext } from "react";
import AddAddress from "../components/AddAddress/AddAddress"

function Add(){
    
    const {logoutPopup} = useContext(AppContext)
    
    return (
        <>
            {logoutPopup}
            <Header page={"add-address"}/>
            <AddAddress />
        </>
    )
}

export default Add