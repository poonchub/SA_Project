import { useContext, useEffect, useState } from 'react';
import './Header.css'
import { Link } from 'react-router-dom';
import { Context } from '../../pages/Product';
import { apiUrl, GetCustomerByID } from '../../services/http';
import { AppContext } from '../../App';
import { Flex } from 'antd';

function Header(props: { page: any; }){

    const {page} = props
    const {searchText, setSearchText, setMode} = useContext(Context)
    const {setLogoutPopup} = useContext(AppContext)
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
            <div className='logout-container'>
                <div className="popup-bg" onClick={()=>setLogoutPopup(null)}></div>
                <div className="detail-box">
                    
                </div>
            </div>
        )
    }

    const isLoggedIn = localStorage.getItem("isLogin") === "true";
    const firstName = isLoggedIn ? (
        <div className="text-box">
            {localStorage.getItem("firstName")}
        </div>
    ) : (
        <div className="text-box">
            Log<span>in</span>
        </div>
    )
    const profilePath = isLoggedIn ? (
        `${apiUrl}/${localStorage.getItem("profilePath")}`
    ) : (
        "./images/icon/account.png"
    )

    const customerElement = isLoggedIn ? (
        <div className="login-box" onClick={showLogoutPopup}>
            <img src={profilePath} alt="" />
            {firstName}
        </div>
    ) : (
        <Link to='/Login' className="login-box">
            <img src={profilePath} alt="" />
            {firstName}
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
    }, [])

    return (
        <div className="container-head">
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
                visibility: page=="product" ? "visible" : "hidden"
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
                    <img src="/images/icon/cart.png" alt="" />
                </Link>
                <div className="line"></div>
                {customerElement}
            </nav>
            
        </div>
    )
}

export default Header;