import { useEffect, useState } from "react";
import { AddressInterface } from "../../Interfaces/IAddress";
import "./AddressChangePopup.css";
import { GetAddressByCustomerID, UpdateOrderAddressByOrderID, GetOrderByID } from "../../services/http";
import { OrderInterface } from "../../Interfaces/IOrder";
import sorryEmoji from '../../assets/woman-bowing-light-skin-tone_1f647-1f3fb-200d-2640-fe0f.png';

function AddressChangePopup(props: { setPopup: any; messageApi: any; orderId: number; onAddressUpdated: () => void }) {

  const { setPopup, messageApi, orderId, onAddressUpdated } = props;

  const customerId = localStorage.getItem('id'); // ดึง customerId จาก localStorage
  const [addresses, setAddresses] = useState<AddressInterface[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null); // ค่าเริ่มต้นของ selectedAddress
  const [orderAddressID, setOrderAddressID] = useState<number | null>(null); // เก็บ AddressID ของ order

  function closePopup() {
    setPopup(null);
  }

  async function fetchOrderData(orderId: number) {
    try {
      const orderData = await GetOrderByID(orderId);
      if (orderData?.AddressID) {
        setOrderAddressID(orderData.AddressID); // ตั้งค่า AddressID จากคำสั่งซื้อ
        setSelectedAddress(orderData.AddressID); // ตั้งค่า selectedAddress เป็นค่าเริ่มต้น
      }
      return orderData?.TotalPrice || 0;
    } catch (error) {
      console.error("Error fetching order data:", error);
      return 0;
    }
  }

  async function handleUpdateOrder() {
    if (selectedAddress === null) {
      messageApi.open({
        type: "error",
        content: "กรุณาเลือกที่อยู่",
        duration: 3,
        style: {
          zIndex: 99999,
        },
      });
      return;
    }

    try {
      const totalPrice = await fetchOrderData(orderId);

      const updateOrderData: OrderInterface = {
        ID: orderId,
        AddressID: selectedAddress,
        TotalPrice: totalPrice,
      };

      const result = await UpdateOrderAddressByOrderID(updateOrderData);

      if (result) {
        messageApi.open({
          type: "success",
          content: "ที่อยู่ถูกอัปเดตเรียบร้อยแล้ว",
          duration: 3,
        });
        setPopup(null); // ปิด popup เมื่อการอัปเดตสำเร็จ
        onAddressUpdated(); // เรียกฟังก์ชันเพื่อรีเฟรชที่อยู่
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาดในการอัปเดตที่อยู่",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการอัปเดตที่อยู่",
      });
    }
  }

  async function getAddress() {
    if (!customerId) {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลลูกค้า",
      });
      return;
    }

    try {
      let res = await GetAddressByCustomerID(parseInt(customerId));
      if (res) {
        setAddresses(res);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }

  useEffect(() => {
    getAddress();
    fetchOrderData(orderId); // ดึงข้อมูลคำสั่งซื้อเมื่อ component mount
  }, [customerId, orderId]);

  const addressElement = addresses.map((subAddress, index) => (
    <table key={index} width={"100%"}>
      <tbody>
        <tr>
          <td style={{ border: "1px solid lightgray", borderRadius: "5px" }}>
            <table>
              <tbody>
                <tr>
                  <td style={{ padding: "0px 10px" }}>
                    <input
                      type="radio"
                      name="Address"
                      checked={selectedAddress === subAddress.ID}
                      onChange={() => setSelectedAddress(subAddress.ID ?? null)}
                    />
                  </td>
                  <td
                    className="detail"
                    onClick={() => setSelectedAddress(subAddress.ID ?? null)}
                    style={{ cursor: 'pointer', width: "auto" }}
                  >
                    {subAddress.AddressDetail}{",\t"}
                    แขวง/ตำบล: {subAddress.Subdistrict}{",\t"}
                    อำเภอ/เขต: {subAddress.District}{",\t"}
                    จังหวัด: {subAddress.Province}{",\t"}
                    รหัสไปรษณีย์: {subAddress.ZipCode}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  ));

  return (
    <div className="popup-container">
      <div className="popup-bg"></div>
      <div className="detail-box">
        <div>
          {addresses.length === 0 ? (
            <>
                <p style={{fontSize: '20px'}}>
                    <div style={{marginBottom: '20px', marginTop: '-15px'}}>ขอโทษค่ะ ไม่พบข้อมูลที่อยู่ของคุณ</div>
                </p>
                <center>
                    <img src={sorryEmoji} style={{width: '60px'}} alt="Sorry" />
                </center> 
                <div className="btn-box">
                        <button className="confirm-btn" style={{width: '60%'}} onClick={closePopup}>ยกเลิก</button>
                </div>
            </>
          ) : (
            <>
                <span className="title">แก้ไขที่อยู่ในการจัดส่ง</span>
                {addressElement}
                <div className="btn-box">
                    <button className="cancel-btn" onClick={closePopup}>ยกเลิก</button>
                    <button className="confirm-btn" onClick={handleUpdateOrder}>ยืนยันการแก้ไข</button>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddressChangePopup;
