import { createContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import ShowDetail from "../components/ShowDetail/ShowDetail";
import ShowImage from "../components/ShowImage/ShowImage";
import Loading from "../animations/Loading/Loading";

export const PopupContext = createContext({setPopup: (param: any) => {}})

function Selected(){

    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState(null)

    

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, [])

    return (
        <PopupContext.Provider value={{setPopup}}>
            {
                loading ?
                    <Loading/>
                :   
                <>
                    {popup}
                    <Header page={"selected"}/>
                    <ShowImage/>
                    <ShowDetail/>
                </>   
            }
        </PopupContext.Provider>
    )
}

export default Selected;