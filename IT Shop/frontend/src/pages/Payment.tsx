import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import OrderShow from "../components/OrderShow/OrderShow";
import AddressShow from "../components/AddressShow/AddressShow";
import AmountPrice from "../components/AmountPrice/AmountPrice";
import OrderTableList from "../components/OrderTableList/OrderTableList";
import "../stylesheet/page.css";
import "../stylesheet/table.css";
import { GetOrderByID } from "../services/http"; // เพิ่มการนำเข้า API

function Payment() {
    // const [icon, setIcon] = useState("/images/icon/back.png");
    const [orderId, setOrderId] = useState<number | null>(null); // สร้าง state สำหรับ orderId

    useEffect(() => {
        // ตัวอย่างการดึง orderId จาก API
        async function fetchOrder() {
            let orderRes = await GetOrderByID(3); // 1 คือตัวอย่าง orderId คุณสามารถเปลี่ยนตามจริง
            if (orderRes) {
                setOrderId(orderRes.id); // สมมติว่า API คืนค่า orderRes.id
            }
        }
        fetchOrder();
    }, []);

    return (
        <>
            <div className="mylayout">
                <Header page={"Payment"} />
                <OrderShow orderId={1} />
                <AddressShow orderId={1} />
                <AmountPrice customerId={1} orderId={1}/> 
                {/* customerId={1} orderId={3} */}
                <div className="mytable">
                    <OrderTableList orderId={1} />
                </div>
            </div>
        </>
    );
}

export default Payment;
