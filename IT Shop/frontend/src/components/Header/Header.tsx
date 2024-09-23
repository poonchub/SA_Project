import { useContext, useEffect, useState } from 'react';
import './Header.css'
import './Header-Home.css'
import { Link } from 'react-router-dom';
import { Context } from '../../pages/Product';
import { apiUrl } from '../../services/http';
import { AppContext } from '../../App';
import { Badge, Popover, List, Dropdown, Menu } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Notification } from '../../Interfaces/INotification';
import { getNotifications } from '../NotificationContext/NotificationContext';

//for countCart
function Header(props: { page: any;}){

    const {page} = props
    const {searchText, setSearchText, setMode} = useContext(Context)
    const {setLogoutPopup, messageApiLogout, contextHolderLogout} = useContext(AppContext)
    const [isToggled, setIsToggled] = useState(true);

    
    // const [notifications, setNotifications] = useState<string[]>(['New order received', 'Payment confirmed', 'Shipment out for delivery']);
    // const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>(getNotifications());
    const [unreadCount, setUnreadCount] = useState(notifications.length);
    
 
    const { countCart } = useContext(AppContext); // ดึง countCart จาก AppContext


    // อ่านการแจ้งเตือนจาก localStorage เมื่อเริ่มต้น
    useEffect(() => {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            const notificationsFromStorage = JSON.parse(storedNotifications);
            setNotifications(notificationsFromStorage);
            setUnreadCount(notificationsFromStorage.length);
        }
    }, []);

    // useEffect(() => {
    //     setNotifications(getNotifications());
        
    // }, []);

    // // เก็บการแจ้งเตือนใหม่ใน localStorage
    // const addNotification = (message: string) => {
    //     const newNotification = { id: notifications.length + 1, message };
    //     const updatedNotifications = [...notifications, newNotification];
    
    //     setNotifications(updatedNotifications);
    //     setUnreadCount((prev) => prev + 1);
    
    //     // เก็บข้อมูลใน localStorage
    //     localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    // };

    const menu = (
        <Menu>
            {notifications.map((note) => (
                <Menu.Item key={note.id}>{note.message}</Menu.Item>
            ))}
        </Menu>
    );

      
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

    function markAsRead() {
        setUnreadCount(0); // รีเซ็ตจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
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
    ) : (page=="edit" || page=="add-address") ? (
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
        const head_notify = document.querySelector("#notify-h")
        if (page=="home" && head_con!=null){
            head_con.setAttribute("class", "container-head-home")
            head_cart?.setAttribute("class","count-cart2")
            head_notify?.setAttribute("class", "notify-change")
        }
        else if (page!="home" && head_con!=null){
            head_con.setAttribute("class", "container-head")
        }

    }, [])

    //  // ตัวอย่างการสร้างการแจ้งเตือน
    //  const handleCreateOrder = () => {
    //     addNotification("ได้ทำการสร้างคำสั่งซื้อของคุณแล้ว");
    // };

    // const handleCreatePayment = () => {
    //     addNotification("ได้ทำการสร้างการชำระเงินแล้ว อยู่ระหว่างตรวจสอบ");
    // };

    // const handlePaymentVerificationComplete = () => {
    //     addNotification("ตรวจสอบการชำระเงินเสร็จสิ้น");
    // };

    return (
        <div className="container-head" id="con-h">
            {contextHolderLogout}
            <div className="left-side">
                {modeElement}
                <div className="logo-box">
                    <div className="img-box">
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
                    {countCart > 0 && (
                        <div className="count-cart1" id='cart-h' >{countCart}</div>
                    )}
                </Link>
                <Popover
                    content={menu}
                    title="Notifications"
                    trigger="click"
                    onVisibleChange={markAsRead}
                >
                    <Badge count={unreadCount}>
                    <BellOutlined 
                        className='notify-contain'
                        id="notify-h" 
                        style={{ 
                            fontSize: '20px',
                        }} 
                    /> 
                    </Badge>
                </Popover>
                <div className="line"></div>
                {customerElement}
            </nav>
        </div>
    )
}

export default Header;
