import { createContext, useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import ShowDetail from "../components/ShowDetail/ShowDetail";
import ShowImage from "../components/ShowImage/ShowImage";
import Loading from "../animations/Loading/Loading";
import { AppContext } from "../App";

export const PopupContext = createContext<{
    setPopup: (param: any) => void
}>({
    setPopup: () => {}
})

function Selected(){

    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState(null)
    const {logoutPopup} = useContext(AppContext)

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1200)
    }, [])

    return (
        <PopupContext.Provider value={{setPopup}}>
            {
                loading ?
                    <Loading/>
                :   
                <>
                    {popup}
                    {logoutPopup}
                    <Header page={"selected"}/>
                    <ShowImage/>
                    <ShowDetail/>
                </>   
            }
        </PopupContext.Provider>
    )
}

export default Selected;