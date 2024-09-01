import "./PopupConfirmOrder.css"

function PopupConfirmOrder(props: { setPopup: any; }){

    const {setPopup} =props

    function closePopup(){
        setPopup(null)
    }

    return (
        <div className="popup-container" onClick={closePopup}>
            <div className="detail-box">
                <span className="title">ยืนยันคำสั่งซื้อ</span>
                
            </div>
        </div>
    )
}

export default PopupConfirmOrder;