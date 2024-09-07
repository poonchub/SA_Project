import { useContext, useEffect, useState } from 'react';
import './Header.css'
import { Link } from 'react-router-dom';
import { Context } from '../../pages/Product';
import { apiUrl, GetCustomerByID } from '../../services/http';

function Header(props: { page: any; }){

    const {page} = props
    const {searchText, setSearchText, setMode} = useContext(Context)
    const [isToggled, setIsToggled] = useState(true);
    const [customer, setCustomer] =useState()

    function toggleMode(){
        setIsToggled(!isToggled);
        if(isToggled){
            setMode("half")
        }
        else{
            setMode("")
        }
    }
    
    async function getCustomer(){
        const id = localStorage.getItem("id")
        if (id !== null) {
            let res = await GetCustomerByID(parseInt(id, 10));
            if (res) {
                setCustomer(res);
            }
        } else {
            console.error("ID is not found in localStorage");
        }
    }

    // @ts-ignore
    const profileUrl = customer!=null ? `${apiUrl}/${customer.ProfilePath}` : "/images/icon/account.png"
    // @ts-ignore
    const firstName = customer!=null ? (<div className="text-box">{customer.FirstName}</div>) 
        : (<div className="text-box">Log-<span>In</span></div>)

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
        getCustomer()
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
                <Link to='/Login' className="login-box">
                    <img src={profileUrl} alt="" />
                    {firstName}
                </Link>
            </nav>
            
        </div>
    )
}

export default Header;