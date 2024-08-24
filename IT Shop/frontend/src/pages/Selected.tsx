import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import ShowDetail from "../components/ShowDetail/ShowDetail";
import ShowImage from "../components/ShowImage/ShowImage";
import Loading from "../animations/Loading/Loading";

function Selected(){

    const [icon, setIcon] = useState("/images/icon/back.png");

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1800)
    }, [])

    return (
        <>
            {
                loading ?
                    <Loading/>
                :   
                <>
                    <Header icon={icon}/>
                    <ShowImage/>
                    <ShowDetail/>
                </>   
            }
        </>
    )
}

export default Selected;