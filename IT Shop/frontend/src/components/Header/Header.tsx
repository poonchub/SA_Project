import { useContext, useEffect, useState } from 'react';
import './Header.css'
import './Header-Home.css'
import { Link } from 'react-router-dom';
import { Context } from '../../pages/Product';
import { apiUrl } from '../../services/http';
import { AppContext } from '../../App';

import CapN from './image-for-logo/letter-n.png'
import CapF from './image-for-logo/letter-f.png'
import CapE from './image-for-logo/letter-e.png'
import CapM from './image-for-logo/letter-m.png'
import CapJ from './image-for-logo/letter-j.png'
import CapBM from './image-for-logo/letter-m black.png'
import CapBF from './image-for-logo/letter-f black.png'
import CapBJ from './image-for-logo/letter-j black.png'
import CapBN from './image-for-logo/letter-n black.png'
import CapBE from './image-for-logo/letter-e black.png'
import CapBS from './image-for-logo/letter-s black.png'
import CapS from './image-for-logo/letter-s.png'
// import CapH from './image-for-logo/'
import CapBH from './image-for-logo/letter-h black.png' 
import CapBO from './image-for-logo/letter-o black.png'
import CapBU from './image-for-logo/letter-u black.png'
import CapBG from "./image-for-logo/letter-g black.png"
import CapG from "./image-for-logo/letter-g (1).png"
import CapL from "./image-for-logo/letter-l (1).png"
import CapBL from "./image-for-logo/letter-l black.png"
import CapK from "./image-for-logo/letter-k (1).png"
import CapBK from "./image-for-logo/letter-k black.png"
import CapH from "./image-for-logo/letter-h.png"
import CapO from "./image-for-logo/letter-o.png"
import CapU from "./image-for-logo/letter-u.png"
// import CapBU1 from './image-for-logo/letter-u black.png'

//for countCart
function Header(props: { page: any;}){

    const {page} = props
    const {searchText, setSearchText, setMode} = useContext(Context)
    const {setLogoutPopup, messageApiLogout, contextHolderLogout} = useContext(AppContext)
    const [isToggled, setIsToggled] = useState(true);
    //count cart
    const { countCart } = useContext(AppContext); // ดึง countCart จาก AppContext

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
                        {/* <img src="/images/Lenovo_Global_Corporate_Logo.png" alt="" /> */}
                        {/* MY<span>&nbsp;LOGO</span> */}
                        <img src={page == "home" ?   CapBS : CapS} id="CapN" />
                        <img src={page == "home" ?   CapBH : CapH} id = "CapF"/>
                        <img src={page == "home" ?   CapBO : CapO} id = "CapO" />
                        <img src={page == "home" ?   CapBU : CapU} id = "CapM" />
                        <img src={page == "home" ?   CapBN : CapN} id='CapJ' />
                        <img src={page == "home" ?   CapBG : CapG} id='CapG' />
                        <img src={page == "home" ?   CapBL : CapL} id='CapL' />
                        <img src={page == "home" ?   CapBE : CapE} id='CapE' />
                        <img src={page == "home" ?   CapBU : CapU} id='CapU' />
                        <img src={page == "home" ?   CapBK : CapK} id='CapK' />
                        
                        

                     

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