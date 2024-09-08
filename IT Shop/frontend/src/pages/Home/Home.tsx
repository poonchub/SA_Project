import { useContext } from "react";
import Header from "../../components/Header/Header";
import { AppContext } from "../../App";
import "./Home.css"
import { Link } from "react-router-dom";
import My3DModel from "../../components/3DModel/3DModel";

function Home(){

    const {logoutPopup} = useContext(AppContext)

    return (
        <>  
            {logoutPopup}
            <Header page={"home"}/>
            <div className="home-container">
                <div className="bg-container">
                    <video className="video-background" src="./videos/bg-home1.mp4" autoPlay loop muted></video>
                </div>
                <div className="text-box">
                    <h1 className="title">Welcome to the <span>ITShop</span></h1>
                    <p className="description">A source of many IT products such as Computers, Laptops, Smart TVs, Gaming Gear and many more.</p>
                </div>
                <Link to="/Product" className="btn-box">
                    <button className="shopnow-btn">Shop Now</button>
                </Link>
                <div className="model-box">
                    <My3DModel/>
                </div>
            </div>
        </>
    )
}

export default Home;