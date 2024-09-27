import React, { useContext, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { GetAddressByOrderID, GetOrderByID } from '../../services/http';
import { AddressInterface } from '../../Interfaces/IAddress';
import '../AddressShow/AddressShow.css';
import edit from '../../assets/edit.svg';
import location from '../../assets/location.svg';
import { PopupContext } from "../../pages/Selected";
import PopupAddressChange from "./AddressChangePopup";

const AddressShow: React.FC<{ orderId: number  }> = ({ orderId }) => {
  const [address, setAddress] = useState<AddressInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false); // State สำหรับจัดการ popup
  const { setPopup } = useContext(PopupContext); // อาจไม่จำเป็นถ้าใช้ local state
  const [customerId, setCustomerId] = useState<number | null>(null); // State สำหรับเก็บ customerId
  const [messageApi, contextHolder] = message.useMessage(); // ใช้ messageApi

  async function fetchAddress() { //เอาไว้อัพเดทที่อยู่บน component
    try {
      const addressRes = await GetAddressByOrderID(orderId);
      if (addressRes) {
        setAddress(addressRes);
      } else {
        setError('ไม่พบข้อมูลที่อยู่');
      }
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลได้');
      console.error(err);
    }
  }

  async function fetchOrderData() {
    try {
      const orderData = await GetOrderByID(orderId);
      if (orderData && orderData.CustomerID) {
        setCustomerId(orderData.CustomerID); // เก็บ customerId ไว้ใน state
      } else {
        setError('ไม่พบข้อมูลลูกค้า');
      }
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลลูกค้าได้');
      console.error(err);
    }
  }


  useEffect(() => {
    fetchAddress();
    // ดึง customerId จาก orderId
    fetchOrderData(); // เรียกใช้เพื่อดึง customerId
  }, [orderId]);


  // ฟังก์ชันเปิด popup แก้ไขที่อยู่
  const showPopup = () => {
    if (customerId !== null) {  // ตรวจสอบให้แน่ใจว่า customerId ไม่เป็น null
      setPopupVisible(true); // แสดง popup
    } else {
      message.error("ไม่พบข้อมูลลูกค้า");
    }
  };

  // ฟังก์ชันปิด popup
  const closePopup = () => {
    setPopupVisible(false); // ปิด popup
  };

  return (
    <div className="custom-cardA">
      {contextHolder}
      <div >
          <div className="card-title">
            <img src={location} alt="Location Icon" className="location-icon" />
            <h6>ที่อยู่ในการจัดส่ง</h6>
          </div>
          <hr style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '0px', color: 'WhiteSmoke',border: 'none', width: '100%' }} />
        {
          address ? (
            <Card className="custom-card-background" style={{width: '100%'}}>
              <div>
                <p>{address.AddressDetail}</p>
                <p>{address.Subdistrict}, {address.District}, {address.Province}, {address.ZipCode}</p>
              </div>
            </Card>
          ) : (
            <p style={{fontSize: '20px', marginTop: '30px'}}>ไม่พบข้อมูลที่อยู่</p>
          )
        }

        {/* ปุ่มแก้ไขที่อยู่ */}
        <div className="btn" onClick={showPopup}>
          <img src={edit} alt="Edit Icon" />
        </div>
        </div>

      {/* แสดง popup เมื่อ isPopupVisible เป็น true และ customerId ไม่เป็น null */}
      {isPopupVisible && customerId !== null && (
        <PopupAddressChange 
          setPopup={closePopup} // ฟังก์ชันปิด popup
          messageApi={messageApi} // ส่ง message api ไปยัง popup
          orderId={orderId} // ส่ง orderId ไปยัง popup
          onAddressUpdated={fetchAddress} // ฟังก์ชันรีเฟรชที่อยู่หลังการอัปเดต
        />
      )}
    </div>
  );
};

export default AddressShow;
