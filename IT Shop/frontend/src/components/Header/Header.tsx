import { useContext, useState } from 'react';
import './Header.css'
import { Link } from 'react-router-dom';
import { Context } from '../../pages/Product';

function Header(props: { page: any; }){

    const {page} = props
    const {searchText, setSearchText, setMode} = useContext(Context)
    const [isToggled, setIsToggled] = useState(true);

    function toggleMode(){
        setIsToggled(!isToggled);
        console.log(isToggled)
        if(isToggled){
            setMode("half")
        }
        else{
            setMode("")
        }
    }

    let modeElement = <></>
    if (page == "product"){
        modeElement = (
            <div className="option-box" onClick={toggleMode}>
                <div className="img-box">
                    <img src={"images/icon/Hamburger.png"} alt="" />
                </div>
            </div>
        )
    }
    else if (page=="selected"){
        modeElement = (
            <Link to="/Product" className="option-box">
                <div className="img-box">
                    <img src={"images/icon/back.png"} alt="" />
                </div>
            </Link>
        )
    }

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
                    <img src="/images/icon/account.png" alt="" />
                    <div className="text-box">
                        Log-<span>In</span>
                    </div>
                </Link>
            </nav>
            
        </div>
    )
}

export default Header;