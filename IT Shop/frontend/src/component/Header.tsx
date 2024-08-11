import '../stylesheet/Header.css'
import { Link } from 'react-router-dom';

function Header(props: { icon: any; }){

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
                        <img src="/images/Lenovo_Global_Corporate_Logo.png" alt="" />
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
                <Link to='/' className='menu'>Home</Link>
                <Link to='/Product' className='menu'>Product</Link>
                <Link to='/Profile' className='menu'>Profile</Link>
                <Link to='/Cart' className="cart-box">
                    <img src="/images/icon/cart.png" alt="" />
                </Link>
                <div className="line"></div>
                <Link to='/Login' className="login-box">
                    <img src="/images/icon/account.png" alt="" />
                    <span>Log-In</span>
                </Link>
            </nav>
            
        </div>
    )
}

export default Header;