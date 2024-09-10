import { useContext, useEffect, useState } from 'react';
import './Header.css'
import './Header-Home.css'
import { Link } from 'react-router-dom';
import { Context } from '../../pages/Product';
import { apiUrl } from '../../services/http';
import { AppContext } from '../../App';

function Header(props: { page: any; }){

    const {page} = props
    const {searchText, setSearchText, setMode} = useContext(Context)
    const {setLogoutPopup, messageApiLogout, contextHolderLogout} = useContext(AppContext)
    const [isToggled, setIsToggled] = useState(true);

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
    
    const profilePath = isLoggedIn ? (
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
        <Link to='/Login' className="login-box">
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
    ) : <></>

    useEffect(()=>{
        const menu = document.querySelector(`#${page}`)
        if (menu!=null){
            menu.setAttribute("class", "menu-selected")
        }

        const head_con = document.querySelector("#con-h")
        if (page=="home" && head_con!=null){
            head_con.setAttribute("class", "container-head-home")
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
                        MY<span>&nbsp;LOGO</span>
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
                </Link>
                <div className="line"></div>
                {customerElement}
            </nav>
            
        </div>
    )
}

export default Header;