import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import '../OrderShow/OrderShow.css';
import cart from '../../assets/cart.svg';
import { GetOrderByID } from '../../services/http';
import { OrderInterface } from '../../Interfaces/IOrder';

const OrderShow: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [order, setOrder] = useState<OrderInterface | null>(null);
  const [displayPrice, setDisplayPrice] = useState<number>(0); // State สำหรับราคาที่แสดงผล
  
  // Format ID
  const Id = order?.ID !== undefined ? order.ID.toString().padStart(10, '0') : 'ไม่ทราบID';
  
  // Format price to 2 decimal places
  const tprice = order?.TotalPrice || 0;
  const formattedPrice = displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Function to fetch order data by ID
  async function GetOrders() {
    try {
      const res = await GetOrderByID(orderId);
      if (res) {
        setOrder(res);
        // Start the price animation
        startPriceAnimation(res.TotalPrice);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  }

  // Function to animate the price
  const startPriceAnimation = (finalPrice: number) => {
    const duration = 1000; // ระยะเวลาในการเพิ่ม (2 วินาที)
    const frameDuration = 1000 / 240; // 60 เฟรมต่อวินาที
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentPrice = finalPrice * progress;

      setDisplayPrice(currentPrice);

      if (frame >= totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
  };

  // Fetch order when component mounts or when orderId changes
  useEffect(() => {
    GetOrders();
  }, [orderId]);

  return (
    <div>
      <Card className="custom-cardO">
        <div className="card-title">
          <img src={cart} alt="" className="location-icon" style={{marginLeft: '-10%'}} />
          <span style={{marginTop: '-2px'}}>หมายเลขคำสั่งซื้อ</span>
          <b className="color-id">{Id}</b> {/* แสดง Order ID */}
          <b className="color-price">฿{formattedPrice}</b> {/* แสดงราคาสุทธิที่กำลังนับขึ้น */}
        </div>
      </Card>
    </div>
  );
};

export default OrderShow;
