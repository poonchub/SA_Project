import { useContext, useEffect, useRef, useState } from 'react';
import './Header.css'
import './Header-Home.css'
import { Link } from 'react-router-dom';
import { Context } from '../../pages/Product';
import { apiUrl } from '../../services/http';
import { AppContext } from '../../App';


import CapBA from '/images/image-for-logo/letter-a.png' 
import CapA  from '/images/image-for-logo/letter-a (1).png' 
import CapH from  '/images/image-for-logo/letter-h.png' 
import CapBH from  '/images/image-for-logo/letter-h black.png' 



//for countCart
function Header(props: { page: any;}){

    const {page} = props
    const {searchText, setSearchText, setMode} = useContext(Context)
    const {setLogoutPopup, messageApiLogout, contextHolderLogout} = useContext(AppContext)
    const [isToggled, setIsToggled] = useState(true);
    //count cart
    const { countCart } = useContext(AppContext); // ดึง countCart จาก AppContext

    const audioRef = useRef(new Audio('audio/keyboard.mp3'))
    const playSound = () => {
        audioRef.current.currentTime = 0.28
        audioRef.current.play()
        setTimeout(() => {
            audioRef.current.pause()
            audioRef.current.currentTime = 0.28
        }, (0.48 - 0.28) * 1000)
    }

    function toggleMode(){
        setIsToggled(!isToggled);
        if(isToggled){
            setMode("half")
        }
        else{
            setMode("")
        }
    }

    function showLogoutPopup(){
        setLogoutPopup(
            <div className='logout-container' id='con-l'>
                <div className="popup-bg" onClick={()=>setLogoutPopup(null)}></div>
                <div className="detail-box" style={{
                    boxShadow: page=="home" ? "0 0 5px 2px var(--subtheme-color1)" : "0 0 5px 2px var(--shadow-color1)"
                }}>
                    <div className="img-box">
                        <img className='img-profile' src={profilePath} alt="" />
                    </div>
                    <div className="name-box">
                        <span>{firstName} </span>
                        <span>{lastName}</span>
                    </div>
                    <button className='logout-btn' onClick={Logout}>Logout</button>
                </div>
            </div>
        )
    }

    const Logout = () => {
		localStorage.clear();
		messageApiLogout.success("Logout successful");
		setTimeout(() => {
		  	location.href = "/";
		}, 2000);
	};

    const isLoggedIn = localStorage.getItem("isLogin") === "true";
    const firstName = localStorage.getItem("firstName")
    const lastName = localStorage.getItem("lastName")
    const showName = isLoggedIn ? (
        <div className="text-box">
            {firstName}
        </div>
    ) : (
        <div className="text-box">
            Log<span>In</span>
        </div>
    )
    
    const profilePath = (isLoggedIn && localStorage.getItem("profilePath")!="") ? (
        `${apiUrl}/${localStorage.getItem("profilePath")}`
    ) : page=="home" ? "./images/icon/user-pink.png" :(
        "./images/icon/user-black.png"
    )

    const customerElement = isLoggedIn ? (
        <div className="login-box" onClick={showLogoutPopup}>
            <div className="img-box">
                <img src={profilePath} alt="" />
            </div>
            {showName}
        </div>
    ) : (
        <Link to='/Login-Customer' className="login-box">
            <div className="img-box">
                <img src={profilePath} alt="" />
            </div>
            {showName}
        </Link>
    )

    const modeElement = (page == "product") ? (
        <div className="option-box" onClick={toggleMode}>
            <div className="img-box">
                <img src={"images/icon/Hamburger.png"} alt="" />
            </div>
        </div>
    ) : (page=="selected") ? (
        <Link to="/Product" className="option-box">
            <div className="img-box">
                <img src={"images/icon/back.png"} alt="" />
            </div>
        </Link>
    ) : (page=="edit-profile" || page=="add-address" || page=="payment") ? (
        <Link to="/profile" className="option-box">
            <div className="img-box">
                <img src={"images/icon/back.png"} alt="" />
            </div>
        </Link>
    ) : <></>

    useEffect(()=>{
        const menu = document.querySelector(`#${page}`)
        if (menu!=null){
            menu.setAttribute("class", "menu-selected")
        }

        const head_con = document.querySelector("#con-h")
        const head_cart = document.querySelector("#cart-h")
        if (page=="home" && head_con!=null){
            head_con.setAttribute("class", "container-head-home")
            head_cart?.setAttribute("class","count-cart2")
        }
        else if (page!="home" && head_con!=null){
            head_con.setAttribute("class", "container-head")
        }

    }, [])

    return (
        <div className="container-head" id="con-h">
            {contextHolderLogout}
            <div className="left-side">
                {modeElement}
                <div className="logo-box">
                    <div className="img-box">
                        <img src={page == "home" ? CapBA : CapA} id="CapA" onMouseEnter={playSound} onMouseLeave={() => audioRef.current.pause()}/>
                        <img src={page == "home" ? CapBH : CapH} id="CapH" onMouseEnter={playSound} onMouseLeave={() => audioRef.current.pause()}/>
                        <img src={page == "home" ? CapBH : CapH} id="CapH2" onMouseEnter={playSound} onMouseLeave={() => audioRef.current.pause()}/> 
                    </div>
                </div>
            </div>
            <div className="search-bar" style={{
                display: page=="product" ? "flex" : "none"
            }}>
                <input 
                    type="text" 
                    placeholder='Search'
                    value={searchText}
                    onChange={(event) => {setSearchText(event.target.value)}}
                />
                <a href="#" className="img-box">
                    <img src="/images/icon/search.png" alt="" />
                </a>
            </div>
            <nav>
                <Link to='/' className='menu' id='home'>Home</Link>
                <Link to='/Product' className='menu' id='product'>Product</Link>
                <Link to='/Profile' className='menu' id='profile'>Profile</Link>
                <Link to='/Cart' className="cart-box">
                    <img src={page=="home" ? "/images/icon/cart-pink.png" : "/images/icon/cart-black.png"} alt="" />
                    {/* add */}
                    {countCart > 0 && (
                       <div className="count-cart1" id='cart-h' >{countCart}</div>
                     )}
                </Link>
                <div className="line"></div>
                {customerElement}
            </nav>
            
        </div>
    )
}

export default Header;