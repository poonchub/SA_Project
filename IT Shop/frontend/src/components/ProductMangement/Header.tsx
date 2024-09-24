import { useContext, useEffect } from 'react';
import './Header-Home.css';
import './Header.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { apiUrl } from '../../services/http';



function Header(props: { page: any; }) {

    const {page} = props
    const {setLogoutPopup, messageApiLogout, contextHolderLogout} = useContext(AppContext)

    function showLogoutPopup(){
        setLogoutPopup(
            <div className='logout-container' id='con-l'>
                <div className="popup-bg" onClick={()=>setLogoutPopup(null)}></div>
                <div className="detail-box" style={{
                    boxShadow: page=="management" ? "0 0 5px 2px var(--subtheme-color1)" : "0 0 5px 2px var(--shadow-color1)"
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

    const OwnerElement = isLoggedIn ? (
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




    useEffect(()=>{
        const menu = document.querySelector(`#${page}`)
        if (menu!=null){
            menu.setAttribute("class", "menu-selected")
        }

        const head_con = document.querySelector("#con-h")
        if (page=="home" && head_con!=null){
            head_con.setAttribute("class", "container-head-home")
        }

    }, [])
    return (
        <div className="container-head" id="con-h">
            {contextHolderLogout}
            <div className="left-side">
                <div className="logo-box">
                    <div className="img-box">
                        Store<span>&nbsp;Management</span>
                    </div>
                </div>
            </div>
            <nav>
                <Link to='/Product/Create' className='menu' id='New-Product'>New Product</Link>
                <Link to={`/OwnerProfile`} className='menu' id='owner-profile'>Profile</Link>
                <div className="line"></div>
                {OwnerElement}
            </nav>
          
        </div>
    );
}

export default Header;
