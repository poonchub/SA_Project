import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import '../OrderShow/OrderShow.css';
import cart from '../../assets/cart.svg';
import { GetOrderByID } from '../../services/http';
import { OrderInterface } from '../../Interfaces/IOrder';

const OrderShow: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [order, setOrder] = useState<OrderInterface | null>(null);
  console.log(order)
  const Id = order?.ID !== undefined ? order.ID.toString().padStart(10, '0') : 'ไม่ทราบID';
  const tprice = order?.TotalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'ไม่ทราบราคา'
  
  
  // ฟังก์ชันเพื่อดึงข้อมูลออเดอร์ตาม ID
  async function GetOrders() {
    let res = await GetOrderByID(orderId); // ส่งค่า ID ที่ต้องการดึงมา เช่น 1
    if (res) {
      setOrder(res);
    }
  }

  useEffect(() => {
    GetOrders(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  return (
    <div>
      <Card className="custom-cardO">
        <div className="card-title">
          <img src={cart} alt="" className="location-icon" />
          <span>Order ID</span>
          <b className="color-id">{Id}</b> {/* แสดง Order ID */}
          <b className="color-price">฿{tprice}</b> {/* แสดงราคาสุทธิ */}
        </div>
      </Card>
    </div>
  );
};

export default OrderShow;
