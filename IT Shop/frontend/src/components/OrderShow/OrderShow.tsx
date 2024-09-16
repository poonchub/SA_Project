import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import '../OrderShow/OrderShow.css';
import cart from '../../assets/cart.svg';
import { GetOrderByID } from '../../services/http';
import { OrderInterface } from '../../Interfaces/IOrder';

const OrderShow: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [order, setOrder] = useState<OrderInterface | null>(null);

  // Format ID and Total Price
  const Id = order?.ID !== undefined ? order.ID.toString().padStart(10, '0') : 'ไม่ทราบID';
  const tprice = order?.TotalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'ไม่ทราบราคา';

  // Function to fetch order data by ID
  async function GetOrders() {
    try {
      const res = await GetOrderByID(orderId);
      if (res) {
        setOrder(res);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  }

  // Fetch order when component mounts or when orderId changes
  useEffect(() => {
    GetOrders();
  }, [orderId]);

  return (
    <div>
      <Card className="custom-cardO">
        <div className="card-title">
          <img src={cart} alt="" className="location-icon" />
          <span>หมายเลขคำสั่งซื้อ</span>
          <b className="color-id">{Id}</b> {/* แสดง Order ID */}
          <b className="color-price">฿{tprice}</b> {/* แสดงราคาสุทธิ */}
        </div>
      </Card>
    </div>
  );
};

export default OrderShow;
