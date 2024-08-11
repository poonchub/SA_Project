import '../stylesheet/Header.css'
import { Link } from 'react-router-dom';

function Header(props: { icon: any}){

    const {icon} = props

    return (
        <div className="container-head">
            <div className="left-side">
                <Link to="/Product" className="hamburger-box">
                    <div className="img-box">
                        <img src={icon} alt="" />
                    </div>
                </Link>
                <div className="logo-box">
                    <div className="img-box">
                        {/* <img src="/images/Lenovo_Global_Corporate_Logo.png" alt="" /> */}
                        MY<span>&nbsp;LOGO</span>
                    </div>
                </div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder='Search'/>
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